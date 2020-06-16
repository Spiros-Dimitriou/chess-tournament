# chess-tournament
 Website that allows chess players to view information, register, sign in and have access to their own data. Supports admin accounts with different privileges.
 
#### Techlologies used
Frontend:
HTML, css, bootstrap, js

Backend:
Js, handlebars, mySQL/mySQL workbench, bcrypt, express/express-session
 
## Installation instructions for localChessTournament_v1.0

#### Deployment Requirements

NodeJS and npm.

#### Installation and local deployment

Install the modules:
npm install
To develop (redeployes locally when backend scripts change):
npm run dev
Simple deployment:
node ./app.js

#### Database Requirements

There needs to be a database for the app to work. Change the contents of the .env file for the one you have.
More info on [npm mySQL](https://www.npmjs.com/package/mysql) and [w3schools](https://www.w3schools.com/nodejs/nodejs_mysql.asp).

###### Initialize Database

Two tables are required as listed in /models/db.init.txt

###### Notes
To insert an admin to the db, the easiest way is to change the query at /models/chessdb.js ln36 with the last value being 1 (admin privileges).
For safety this has to be done in a local deployment. Go to localhost:3001/register and register an admin.
