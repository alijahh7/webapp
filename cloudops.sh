#!/bin/bash

#Installing OPS agent
curl -sSO https://storage.googleapis.com/cloud-ops-agent/ga/install.sh
sudo bash install.sh

#YAML


#create file at /etc/google-cloud-ops-agent/config.yaml

#restart ops agent
sudo systemctl restart google-cloud-ops-agent