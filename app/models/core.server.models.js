const db = require('../../database');

const createItem = (name, description, starting_bid, end_date, callback) => {
    const sql = 'INSERT INTO items(name, description, starting_bid, end_date) VALUES (?, ?, ?, ?)';
    const values = [name, description, starting_bid, end_date];

    db.run(sql, values, function (err) {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

module.exports = {
    createItem
};