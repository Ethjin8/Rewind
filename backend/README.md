## JWT Token Secret Keys
In terminal, run the following two commands:
- `nod`
- `require('crypto').randomBytes(64).toString('hex')`

This gives you a random 64-byte integer, which you can use to sign your JWT tokens. Run the pair of commands twice to get ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET, then paste those values into your .env file.

## Database Setup
Install MySQL on your computer with the following commands:
- Mac: `brew install mysql`
- Windows: Download the installer from https://dev.mysql.com/downloads/installer/
- Linux: `sudo apt install mysql-server`

Run `mysql --version` to check that the client is installed.

The schema.sql file contains the necessary commands to set up your local database in MySQL. The primary database will be called `backlog_db`, with two tables: `users` and `movies_shows`. To run it, simply type `mysql -u root -p < schema.sql`.