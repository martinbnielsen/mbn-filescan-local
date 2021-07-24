  
#!/bin/bash

# Start the clamAV services
echo "Starting ClamAV"
freshclam -F
sleep 10
clamd &
freshclam -d &
echo "Waiting for clamAV to start..."
while [ ! -S /run/clamav/clamd.sock ]
do
  echo "Waiting for clamAV to start..."
  sleep 2 # or less like 0.2
done
sleep 2

echo ""
echo "$( date ) The ClamAV container is ready"

# Start the node application
echo "Starting MBN Data Local file scan service on http://localhost:3000"
cd $APP_PATH
node index.js & tail -f /var/log/clamav/freshclam.log