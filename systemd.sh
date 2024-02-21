#!/bin/bash

sudo cp /opt/webapp/csye6225.service /etc/systemd/system/csye6225.service
sudo systemctl daemon-reload
sudo systemctl enable csye6225