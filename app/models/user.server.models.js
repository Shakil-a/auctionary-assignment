const db = require('../../database');

const createUser = (first_name, last_name, email, hash, salt, callback) => {
    const sql = 'INSERT INTO users(first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)';
    const values = [first_name, last_name, email, hash, salt];

    db.run(sql, values, function (err) {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

module.exports = {
    createUser
};