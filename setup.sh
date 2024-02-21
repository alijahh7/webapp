#!/bin/bash

#Installing any updates
#dnf update

# Install Node.js
echo "Installing Node.js..."
sudo dnf module -y enable nodejs:20
sudo dnf module -y install nodejs:20/common

# Install and start PostgreSQL
echo "Installing and starting PostgreSQL..."
sudo dnf module list postgresql
sudo dnf module enable -y postgresql:12
sudo dnf install -y postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install unzip
echo "Installing unzip..."
sudo dnf -y install unzip

# Edit pg_hba.conf for ident —> trust
# Edit pg_hba.conf for ident —> trust
echo "Editing pg_hba.conf..."
sudo sed -i 's/local   all             all                                     peer/local   all             all                                     trust/g' /var/lib/pgsql/data/pg_hba.conf
sudo sed -i 's/host.*all.*all.*127\.0\.0\.1\/32.*ident/host    all             all             127.0.0.1\/32            trust/g' /var/lib/pgsql/data/pg_hba.conf
sudo sed -i 's/host.*all.*all.*::1\/128.*ident/host    all             all             ::1\/128                 trust/g' /var/lib/pgsql/data/pg_hba.conf
sudo service postgresql restart
cat /var/lib/pgsql/data/pg_hba.conf

echo "Creating user and DB"
sudo -u postgres psql -c "CREATE USER a WITH PASSWORD 'abc';"
sudo -u postgres psql -c "CREATE DATABASE mydb;"

echo "DONE!"

