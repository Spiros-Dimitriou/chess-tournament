# chess-tournament
 Website that allows chess players to view information, register, sign in and have access to their own data. Supports admin accounts with different privileges.
 
#### Technologies/frameworks used
Frontend:
- HTML
- CSS
- Bootstrap
- JavaScript

Backend:
- JavaScript
- Handlebars
- mySQL
- Bcrypt
- Node Express & Node express-session
 
### Installation instructions

#### Deployment Requirements

NodeJS and npm.

#### Installation and local deployment

`npm install` install modules

`npm run dev` deploy for development

or

`node app.js` for simple deployment

#### Database Requirements

The app is designed to work with a mySQL database. Change the contents of the .env file for your db.
More info on [npm mySQL](https://www.npmjs.com/package/mysql) and [w3schools](https://www.w3schools.com/nodejs/nodejs_mysql.asp).

#### Initialize Database

Two tables are required as listed in /models/db.init.txt

#### Notes
To insert an admin to the db, the easiest way, just change the query at /models/chessdb.js ln36 with the last value being 1 (admin privileges). Navigate to localhost:3001/register and register an admin. Revert afterwards.
