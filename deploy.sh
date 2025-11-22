 

set -euo pipefail
echo "Server IP: "
read SERVER_IP
echo "SSH Username: "
read SERVER_USER

echo "SSH Port (default 22): "
read SERVER_PORT
SERVER_PORT=${SERVER_PORT:-22}

echo "Remote path (press Enter for /var/www/app): "
read REMOTE_PATH
REMOTE_PATH=${REMOTE_PATH:-/var/www/app}
echo "REMOTE_PATH: $REMOTE_PATH"
echo "Use Yarn for install/build/start on port 3000? (Y/n): "
read RUN_YARN_PORT
RUN_YARN_PORT=${RUN_YARN_PORT:-y}
RUN_YARN_PORT=$(echo "$RUN_YARN_PORT" | tr '[:upper:]' '[:lower:]')

UPLOAD_DIR="/tmp/next-upload"
rm -rf "$UPLOAD_DIR"
mkdir -p "$UPLOAD_DIR"

  echo "Preparing clean upload directory..."

shopt -s dotglob
for item in ./*; do
  name=$(basename "$item")

  case "$name" in
    node_modules|.git|.github|.next|document|logs)
      echo "Skipping folder: $name"
      continue
      ;;
    .env*)
      echo "Including env file: $name"
      ;;
    .* )
      if [ -d "$item" ]; then
        echo "Skipping hidden directory: $name"
        continue
      fi
      ;;
  esac

  cp -R "$item" "$UPLOAD_DIR"/
done
shopt -u dotglob

echo "Uploading files..."
scp -r -P "$SERVER_PORT" "$UPLOAD_DIR"/* "$SERVER_USER@$SERVER_IP:$REMOTE_PATH/"

echo ""
echo "Connecting to server..."
ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_IP" "
  cd $REMOTE_PATH
  set -euo pipefail

  if [ \"$RUN_YARN_PORT\" = \"y\" ]; then
    echo 'Installing dependencies with Yarn...'
    yarn install --ignore-engines
    
    ls
    echo "--------------------------------"
    
    echo 'Building Next.js with Yarn...'
    yarn build

    START_COMMAND='yarn start --port 3000'
  else
    echo 'Installing dependencies with npm...'
    npm install --omit=dev --legacy-peer-deps --ignore-engines

    echo 'Building Next.js with npm...'
    npm run build

    START_COMMAND='npm run start'
  fi

  if pm2 info next-app >/dev/null 2>&1; then
    pm2 delete next-app
  fi

  pm2 start bash --name next-app  -- -lc \"\$START_COMMAND\"

  pm2 save
"
