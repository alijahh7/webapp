# Local - Assignment 1
##DEMO
## webapp
```npm install```
```node index.js```
## postgres 
```brew services start postgresql```
```brew services stop postgresql ```
```psql -d mydb```

# for CentOS - Assignment 2
1. Installing Node:
```dnf module -y enable nodejs:20```
```dnf module -y install nodejs:20/common```

2. Installing and starting PostgreSQL
```dnf module list postgresql```
```sudo dnf module enable postgresql:12```
```sudo dnf install postgresql-server```
```sudo postgresql-setup —-initdb```
```sudo systemctl start postgresql```
```sudo systemctl enable postgresql```

3.  Installing unzip:
 
```sudo dnf -y install unzip```

# for Integration test - Assignment 3
```npx jest```
 
 



