#!/bin/bash

#Installing OPS agent
# curl -sSO https://storage.googleapis.com/cloud-ops-agent/ga/install.sh
# sudo bash install.sh
sudo curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

#create file at /etc/google-cloud-ops-agent/config.yml
# sudo cat > /etc/google-cloud-ops-agent/config.yaml <<EOF
# logging:
#   receivers:
#     my-app-receiver:
#       type: files
#       include_paths:
#         - /var/log/webapp/*.log
#       record_log_file_path: true
#   processors:
#     my-app-processor:
#       type: parse_json
#       time_key: time
#       time_format: "%Y-%m-%dT%H:%M:%S.%L%Z"
# service:
#   pipelines:
#     default_pipeline:
#       receivers: [my-app-receiver]
#       processors: [my-app-processor]
# EOF
sudo cp /opt/webapp/config.yaml /etc/google-cloud-ops-agent/config.yaml

#restart ops agent
sudo systemctl restart google-cloud-ops-agent

#mkdir and give permissions for: var/log/webapp
cd ~
sudo mkdir /var/log/webapp
echo "Changing Ownership..."
sudo chown -R csye6225:csye6225 "/var/log/webapp/"
echo "Checking Ownership of webapp logs"
ls -l "/var/log/webapp/"
