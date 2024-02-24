#!/bin/bash
done_file="/tmp/startup.sh.done"

check_startup_script_status() {
    if [ -f "$done_file" ]; then
        return 0 #file found
    else
        return 1 #file not found
    fi
}


while ! check_startup_script_status; do
    echo "Waiting for startup script to finish..."
    sleep 10
done

echo "Startup Script Completed. Starting service..."

#service commands
sudo cp /opt/webapp/csye6225.service /etc/systemd/system/csye6225.service
sudo systemctl daemon-reload
sudo systemctl enable csye6225