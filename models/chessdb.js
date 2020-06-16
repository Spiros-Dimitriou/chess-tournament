'use strict';
let connection = require('./db.mysql.js');

// search db based on ID
// returns user details (JSON), else returns "db-error"
// uses callback
exports.fetchUserId = function (id, cb) {
    connection.query('SELECT * FROM `users` WHERE `id`=?', id, function (error, results, fields) {
        if (error) {
            console.log(error);
            return cb("db-error");
        }
        else
            return cb(results[0]);
    });
};

// search db based on email
// returns user details (JSON), else returns "db-error"
// uses callback
exports.fetchUserEmail = function (email, cb) {
    connection.query('SELECT * FROM `users` WHERE `email`=?', email, function (error, results, fields) {
        if (error) {
            console.log(error);
            return cb("db-error");
        }
        else
            return cb(results[0]);
    });
};

// inserts user data in db
// returns "success", else returns "db-error"
// uses callback
exports.registerUser = function (user, cb) {
    connection.query("INSERT INTO `users` (`id`, `name`,`email`,`yob`,`elo`,`unlimited`,`min10`,`min5`,`pass`, `adminpriv`) VALUES(NULL,?,?,?,?,?,?,?,?,0)",
        [user.name, user.email, user.yob, user.user_rank, user.game_unlimited ? '1' : '0', user.game_10min ? '1' : '0', user.game_5min ? '1' : '0', user.pass],
        function (error, _results, _fields) {
            if (error) {
                console.log(error);
                return cb("db-error");
            }
            else
                return cb("success");
        });
};

// search db based on name
// returns 10 users at most
// uses callback
exports.searchUsers = function (name, cb) {
    connection.query("SELECT * FROM users WHERE name LIKE ? LIMIT 10",
        ['%'+name+'%'],
        function (error, results, _fields) {
            if (error) {
                console.log(error);
                return cb("db-error");
            }
            else
                return cb(results);
        });
};

// insert a message in the db (for the admins to see only)
// returns "success", else returns "db-error"
// uses callback
exports.insertMessage = function (email, message, cb) {
    connection.query("INSERT INTO `chess_db`.`messages` (`id`, `email`, `message`) VALUES (NULL, ?, ?)",
        [email, message],
        function (error, _results, _fields) {
            if (error) {
                console.log(error);
                return cb("db-error");
            }
            else
                return cb("success");
        });
};

exports.deleteUserEmail = function (email, cb) {
    connection.query('DELETE FROM `users` WHERE `email`=?', email, function (error, results, fields) {
        if (error) {
            console.log(error);
            return cb("db-error");
        }
        else
            return cb("success");
    });
};

exports.fetchMessages = function (cb) {
    connection.query("SELECT * FROM messages",
        function (error, results, _fields) {
            if (error) {
                console.log(error);
                return cb("db-error");
            }
            else
                return cb(results);
        });
};