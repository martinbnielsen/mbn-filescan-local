  
#!/bin/bash

set -euo pipefail
echo "Starting the ClamAV container"
echo "Updating ClamAV scan DB"
set +e
freshclam
FRESHCLAM_EXIT=$?
set -e
echo ""

if [[ "$FRESHCLAM_EXIT" -eq "0" ]]; then
    echo ""
    echo "Freshclam updated the DB"
    echo ""
elif [[ "$FRESHCLAM_EXIT" -eq "1" ]]; then
    echo ""
    echo "ClamAV DB already up to date..."
    echo ""
else
    echo ""
    echo "An error occurred (freshclam returned with exit code '$FRESHCLAM_EXIT')"
    echo ""
    exit $FRESHCLAM_EXIT
fi
echo ""
clamscan -V

# TODO: Setup periodic virus database polling

echo ""
echo "$( date ) The ClamAV container is ready"

# TODO: Start the node rest server here, for now, just stay alive
/bin/bash