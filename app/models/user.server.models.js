const db = require('../../database');

const createUser = (first_name, last_name, email, hash, salt, callback) => {
    const sql = 'INSERT INTO users(first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)';
    const values = [first_name, last_name, email, hash, salt];

    db.run(sql, values, function (err) {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

const getUserByEmail = (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) return callback(err);
        return callback(null, row);
    });
};

const setToken = (user_id, session_token, callback) => {
    const sql = 'UPDATE users SET session_token = ? WHERE user_id = ?';
    db.run(sql, [session_token, user_id], function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

const getUserByToken = (session_token, callback) => {
    const sql = 'SELECT user_id, first_name, last_name, email FROM users WHERE session_token = ?';
    db.get(sql, [session_token], (err, row) => {
        if (err) return callback(err);
        return callback(null, row);
    });
};

const deleteToken = (session_token, callback) => {
    const sql = 'UPDATE users SET session_token = NULL WHERE session_token = ?';
    db.run(sql, [session_token], function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

const getUserById = (id, callback) => {
    const sql = 'SELECT user_id, first_name, last_name, email FROM users WHERE user_id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) return callback(err);
        return callback(null, row);
    });
};
module.exports = {
    createUser,
    getUserByEmail,
    setToken,
    getUserByToken,
    deleteToken,
    getUserById
};