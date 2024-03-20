#!/bin/bash

#Installing OPS agent
curl -sSO https://storage.googleapis.com/cloud-ops-agent/ga/install.sh
sudo bash install.sh

#create file at /etc/google-cloud-ops-agent/config.yml
cat > /etc/google-cloud-ops-agent/config.yml <<EOF
logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /var/log/webapp/*.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: time
      time_format: "%Y-%m-%dT%H:%M:%S.%L%Z"
service:
  pipelines:
    default_pipeline:
      receivers: [my-app-receiver]
      processors: [my-app-processor]
EOF

#restart ops agent
sudo systemctl restart google-cloud-ops-agent

#mkdir and give permissions for: var/log/webapp
cd ~
sudo mkdir /var/log/webapp
echo "Changing Ownership..."
sudo chown -R csye6225:csye6225 "/var/log/webapp/"
echo "Checking Ownership of webapp logs"
ls -l "/var/log/webapp/"
