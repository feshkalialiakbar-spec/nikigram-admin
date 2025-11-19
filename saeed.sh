#!/bin/bash

set -uo pipefail
# Note: removed 'e' flag to allow continuation on non-critical errors

# Hardcoded configuration values
SERVER_IP="185.213.165.166"
SERVER_USER="root"
SERVER_PORT="1996"
REMOTE_PATH="/var/www/hisabdarni"
USE_YARN="n"  # Use npm instead of yarn

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Error handler
error_exit() {
    log_error "$1"
    exit 1
}

# Check if required commands exist
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v ssh &> /dev/null; then
        error_exit "ssh command not found"
    fi
    
    if ! command -v scp &> /dev/null; then
        error_exit "scp command not found"
    fi
    
    log_info "All requirements met"
}

# Test SSH connection
test_ssh_connection() {
    log_info "Testing SSH connection to $SERVER_USER@$SERVER_IP:$SERVER_PORT..."
    
    if ssh -p "$SERVER_PORT" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "echo 'Connection successful'" &> /dev/null; then
        log_info "SSH connection successful"
    else
        error_exit "Failed to connect to server. Please check your SSH credentials and network connection."
    fi
}

# Prepare upload directory
prepare_upload() {
    UPLOAD_DIR="/tmp/next-upload-$(date +%s)"
    
    log_info "Preparing clean upload directory: $UPLOAD_DIR"
    rm -rf "$UPLOAD_DIR" 2>/dev/null || true
    if ! mkdir -p "$UPLOAD_DIR"; then
        error_exit "Failed to create upload directory"
    fi
    
    log_info "Copying files (excluding node_modules, .git, .github, .next, document)..."
    
    shopt -s dotglob
    local copied_count=0
    local skipped_count=0
    
    for item in ./*; do
        name=$(basename "$item")
        
        case "$name" in
            node_modules|.git|.github|.next|document)
                log_warn "Skipping folder: $name"
                ((skipped_count++))
                continue
                ;;
            .env*)
                log_info "Including env file: $name"
                ;;
            .*)
                if [ -d "$item" ]; then
                    log_warn "Skipping hidden directory: $name"
                    ((skipped_count++))
                    continue
                fi
                ;;
        esac
        
        if cp -R "$item" "$UPLOAD_DIR"/ 2>/dev/null; then
            ((copied_count++))
        else
            log_warn "Failed to copy $name, continuing..."
            ((skipped_count++))
        fi
    done
    shopt -u dotglob
    
    log_info "Copied $copied_count items, skipped $skipped_count items"
}

# Upload files to server
upload_files() {
    log_info "Uploading files to server..."
    
    if scp -r -P "$SERVER_PORT" -o StrictHostKeyChecking=no "$UPLOAD_DIR"/* "$SERVER_USER@$SERVER_IP:$REMOTE_PATH/" 2>&1; then
        log_info "Files uploaded successfully"
    else
        error_exit "Failed to upload files to server"
    fi
    
    # Cleanup local upload directory
    log_info "Cleaning up local upload directory..."
    rm -rf "$UPLOAD_DIR" 2>/dev/null || log_warn "Failed to cleanup upload directory (non-critical)"
}

# Deploy on server
deploy_on_server() {
    log_info "Connecting to server and deploying..."
    
    ssh -p "$SERVER_PORT" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" <<EOF
set -uo pipefail
# Note: removed 'e' flag for better error handling

cd "$REMOTE_PATH" || exit 1

echo "[SERVER] Current directory: \$(pwd)"
echo "[SERVER] Node version: \$(node --version 2>/dev/null || echo 'Not found')"
echo "[SERVER] NPM version: \$(npm --version 2>/dev/null || echo 'Not found')"

if [ "$USE_YARN" = "y" ]; then
    echo "[SERVER] Installing dependencies with Yarn..."
    if ! yarn install --ignore-engines; then
        echo "[SERVER] ERROR: Failed to install dependencies with Yarn"
        exit 1
    fi
    
    echo "[SERVER] Building Next.js with Yarn..."
    if ! yarn build; then
        echo "[SERVER] ERROR: Failed to build with Yarn"
        exit 1
    fi
    
    START_COMMAND='yarn start --port 3000'
else
    echo "[SERVER] Installing dependencies with npm..."
    if ! npm install --omit=dev --legacy-peer-deps --ignore-engines; then
        echo "[SERVER] ERROR: Failed to install dependencies with npm"
        exit 1
    fi
    
    echo "[SERVER] Building Next.js with npm..."
    if ! npm run build; then
        echo "[SERVER] ERROR: Failed to build with npm"
        exit 1
    fi
    
    START_COMMAND='npm run start'
fi

echo "[SERVER] Managing PM2 process..."
if pm2 info next-app >/dev/null 2>&1; then
    echo "[SERVER] Stopping existing next-app process..."
    pm2 delete next-app || true
fi

echo "[SERVER] Starting application with PM2..."
if ! pm2 start bash --name next-app -- -lc "\$START_COMMAND"; then
    echo "[SERVER] ERROR: Failed to start application with PM2"
    exit 1
fi

echo "[SERVER] Saving PM2 configuration..."
if ! pm2 save; then
    echo "[SERVER] WARNING: Failed to save PM2 configuration (non-critical)"
fi

echo "[SERVER] PM2 status:"
pm2 status

echo "[SERVER] Deployment completed successfully!"
EOF

    local ssh_exit_code=$?
    if [ $ssh_exit_code -eq 0 ]; then
        log_info "Deployment completed successfully!"
        return 0
    else
        log_error "Deployment failed on server (exit code: $ssh_exit_code)"
        return 1
    fi
}

# Main execution
main() {
    log_info "Starting deployment process..."
    log_info "Server: $SERVER_USER@$SERVER_IP:$SERVER_PORT"
    log_info "Remote path: $REMOTE_PATH"
    log_info "Package manager: $([ "$USE_YARN" = "y" ] && echo 'Yarn' || echo 'npm')"
    
    local failed=0
    
    check_requirements || failed=1
    test_ssh_connection || failed=1
    if [ $failed -eq 1 ]; then
        error_exit "Critical requirements check failed"
    fi
    
    prepare_upload || failed=1
    if [ $failed -eq 1 ]; then
        error_exit "Failed to prepare upload"
    fi
    
    upload_files || failed=1
    if [ $failed -eq 1 ]; then
        error_exit "Failed to upload files"
    fi
    
    if ! deploy_on_server; then
        failed=1
    fi
    
    if [ $failed -eq 1 ]; then
        log_error "Deployment completed with errors. Please check the logs above."
        exit 1
    else
        log_info "All done! Application should be running on the server."
    fi
}

# Run main function
main
