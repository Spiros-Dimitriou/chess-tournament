/////////////////////////////////////////////////////////////////////
// app initialization //
/////////////////////////////////////////////////////////////////////

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser"); // parser of the body of the request
const bcrypt = require("bcrypt");
const hbs = require("express-handlebars");
require("dotenv").config();

const parseurl = require("parseurl");
// the hashing parameter with which passwords are hashed
const salt = process.env.PASS_HASH;

// two hours in milliseconds (cookie expiration time)
const TWO_HOURS = 1000 * 60 * 60 * 2;

const app = express();
app.use(express.static('static'));

// handlebars is used for rendering the HTML files
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// all database functions are included in the db model
const model = require('./models/chessdb.js');

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// express-session middleware for the app
// handles the session for the person visiting the site
app.use(session({
    name: process.env.SESS_NAME,
    secret: process.env.SESSION_SECRET, // SESSION_SECRET is an .env parameter
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: TWO_HOURS, // διάρκεια ζωής cookie σε ms (60sec = 1 min)
        sameSite: true
    }
}));

/////////////////////////////////////////////////////////////////////
// side-functions for user credibility //
/////////////////////////////////////////////////////////////////////

// redirects the user if they're not logged in and trying to access sensitive data
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
};

// redirects the user if they're logged in and trying to access /login or /register
const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/my-profile');
    } else {
        next();
    }
};

// function that determines the value 'loggedIn' sent to the layout.hbs via params
// if 'loggedIn' exists in params, the links for login and register are not rendered
const determineLogIn = (req) => {
    if (req.session.userId)
        return { 'loggedIn': 'true' };
    else
        return {};
};

/////////////////////////////////////////////////////////////////////
// routing and control //
/////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.redirect('home');
});

app.get('/home', (req, res) => {
    let params = determineLogIn(req);
    res.render('home', params);
});

app.get('/info', (req, res) => {
    let params = determineLogIn(req);
    res.render('info', params);
});

app.get('/sponsors', (req, res) => {
    let params = determineLogIn(req);
    res.render('sponsors', params);
});

app.get('/contact', (req, res) => {
    let params = determineLogIn(req);
    res.render('contact', params);
});

app.get('/profile/:userId', (req, res) => {
    let params = determineLogIn(req);
    model.fetchUserId(req.params.userId, (user) => {
        if (user === "db-error") {
            // db error
            return res.render("db-error");
        }
        else if (!user) {
            // no user found
            return res.sendStatus(404);
        }
        else if (user) {
            // user found
            // modifying the values so handlebars can render easily
            user.unlimited = (user.unlimited === 1) ? 'Ναι' : 'Όχι';
            user.min10 = (user.min10 === 1) ? 'Ναι' : 'Όχι';
            user.min5 = (user.min5 === 1) ? 'Ναι' : 'Όχι';
            switch (user.elo) {
                case 0:
                    user.elo = 'ως 1400';
                    break;
                case 1:
                    user.elo = '1400-1800';
                    break;
                case 2:
                    user.elo = '1800+';
            }
            if (user.adminpriv === 0)
                delete user.adminpriv;
            params['user'] = user;
            return res.render('profile', params);
        }
    });
});

app.get('/my-profile', redirectLogin, (req, res) => {
    let params = determineLogIn(req);
    model.fetchUserEmail(req.session.userId, (user) => {
        if (user === "db-error") {
            // db error
            return res.render("db-error");
        }
        else if (!user) {
            // no user found
            return res.sendStatus(404);
        }
        else if (user) {
            // user found
            // modifying the values so handlebars can render easily
            user.unlimited = (user.unlimited === 1) ? 'Ναι' : 'Όχι';
            user.min10 = (user.min10 === 1) ? 'Ναι' : 'Όχι';
            user.min5 = (user.min5 === 1) ? 'Ναι' : 'Όχι';
            switch (user.elo) {
                case 0:
                    user.elo = 'ως 1400';
                    break;
                case 1:
                    user.elo = '1400-1800';
                    break;
                case 2:
                    user.elo = '1800+';
            }
            if (user.adminpriv === 0) {
                delete user.adminpriv;
                params['user'] = user;
                return res.render('my-profile', params);
            }
            else if (user.adminpriv === 1) {
                params['user'] = user;
                model.fetchMessages((messages) => {
                    if (messages === "db-error") {
                        // db error
                        return res.render("db-error");
                    }
                    else if (messages) {
                        // messages found
                        params['messages'] = messages;
                        return res.render("my-profile", params);
                    }
                });
            }
        }
    });
});

app.get('/delete-profile', redirectLogin, (req, res) => {
    model.deleteUserEmail(req.session.userId, (result) => {
        if (result === "db-error") {
            // db error
            return res.render("db-error");
        }
        else if (result === "success") {
            // user deleted from db
            req.session.destroy(err => {
                if (err) {
                    return res.redirect('/my-profile');
                }
                res.clearCookie(process.env.SESS_NAME);
                return res.render("del-complete");
            });
        }
    });
});

app.post('/contact', (req, res) => {
    let params = determineLogIn(req);
    model.insertMessage(req.body.email, req.body.message, (result) => {
        if (result === "db-error") {
            // db error
            return res.render("db-error");
        }
        else if (result === "success") {
            // message inserted in db
            return res.render("message-complete", params);
        }
    });
});

app.post('/search', (req, res) => {
    let params = determineLogIn(req);
    model.searchUsers(req.body.name, (users) => {
        if (users === "db-error") {
            // db error
            return res.render("db-error");
        }
        else if (users) {
            // users found
            params['users'] = users;
            params['searchQuery'] = req.body.name;
            return res.render("search-results", params);
        }
    });
});

app.get('/register', redirectHome, (req, res) => {
    res.render("register");
});

app.post('/register', redirectHome, (req, res) => {
    model.fetchUserEmail(req.body.email, (user) => {
        if (user === "db-error") {
            // db error
            return res.render("db-error");
        }
        else if (user) {
            // user found
            return res.render("email-used");
        }
        else if (!user) {
            // no user found
            req.body.pass = bcrypt.hashSync(req.body.pass, salt);
            model.registerUser(req.body, (result) => {
                if (result === "db-error") {
                    // db error
                    return res.render("db-error");
                }
                else if (result === "success") {
                    // user inserted in db
                    return res.render("reg-complete");
                }
            });
        }
    });
});

app.get("/login", redirectHome, (req, res) => {
    res.render("login");
});

app.post("/login", redirectHome, (req, res) => {
    // search in db with email
    model.fetchUserEmail(req.body.email, (user) => {
        if (user === "db-error") {
            // db error
            return res.render("db-error");
        }
        else if (!user) {
            // no user found
            return res.render("login-fail");
        }
        else {
            // user found
            if (bcrypt.hashSync(req.body.pass, salt) === user.pass) {
                // correct password
                req.session.userId = user.email;
                return res.redirect("/my-profile");
            }
            else {
                // wrong password
                return res.render("login-fail");
            }
        }
    });
});

app.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/my-profile');
        }
        res.clearCookie(process.env.SESS_NAME);
        res.redirect("/");
    });
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

/////////////////////////////////////////////////////////////////////
// app start //
/////////////////////////////////////////////////////////////////////

PORT = process.env.PORT || 3001;

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else console.log(`συνδεθείτε στη σελίδα: http://localhost:${PORT}`);
});