#!/bin/bash

#echo "Installing updates"
#dnf update

echo "Installing Node.js..."
sudo dnf module -y enable nodejs:20
sudo dnf module -y install nodejs:20/common

echo "Installing and starting PostgreSQL..."
sudo dnf module list postgresql
sudo dnf module enable -y postgresql:12
sudo dnf install -y postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo "Installing unzip"
sudo dnf -y install unzip

echo "Editing pg_hba.conf"
sudo sed -i 's/local   all             all                                     peer/local   all             all                                     trust/g' /var/lib/pgsql/data/pg_hba.conf
sudo sed -i 's/host.*all.*all.*127\.0\.0\.1\/32.*ident/host    all             all             127.0.0.1\/32            trust/g' /var/lib/pgsql/data/pg_hba.conf
sudo sed -i 's/host.*all.*all.*::1\/128.*ident/host    all             all             ::1\/128                 trust/g' /var/lib/pgsql/data/pg_hba.conf
sudo service postgresql restart
cat /var/lib/pgsql/data/pg_hba.conf

echo "Creating user and DB"
sudo -u postgres psql -c "CREATE USER $db_user WITH PASSWORD '$db_pass';"
sudo -u postgres psql -c "CREATE DATABASE $db_name;"

echo "Creating group"
sudo groupadd csye6225

echo "Creating system user"
sudo useradd -M -s /usr/sbin/nologin -g csye6225 csye6225
id csye6225

echo "Unzipping artifacts..."
sudo unzip "/tmp/webapp.zip" -d /opt/
cd /opt/webapp
ls

# Change ownership
echo "Changing Ownership..."
sudo chown -R csye6225:csye6225 "/opt/webapp/"
#sudo chmod -R 755 /opt/webapp

echo "Checking Ownership of webapp"
ls -l "/opt/webapp/"

# Install dependencies
echo "Installing dependencies..."
cd "/opt/webapp"
sudo npm install

echo "DONE!"

