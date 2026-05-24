## Database Setup
Install MySQL on your computer with the following commands:
- Mac: `brew install mysql`
- Windows: Download the installer from https://dev.mysql.com/downloads/installer/
- Linux: `sudo apt install mysql-server`

Run `mysql --version` to check that the client is installed.

The schema.sql file contains the necessary commands to set up your local database in MySQL. The primary database will be called `media_backlog`, with two tables: `users` and `movies_shows`. To run it, simply type `mysql -u root -p < schema.sql`.