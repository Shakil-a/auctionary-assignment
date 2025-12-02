const db = require('../../database');

const createItem = (name, description, starting_bid, end_date, callback) => {
    const sql = 'INSERT INTO items(name, description, starting_bid, end_date) VALUES (?, ?, ?, ?)';
    const values = [name, description, starting_bid, end_date];

    db.run(sql, values, function (err) {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

const createBid = (item_id, user_id, amount, callback) => {
    const sql = 'INSERT INTO bids(item_id, user_id, amount) VALUES (?, ?, ?)';
    const values = [item_id, user_id, amount];

    db.run(sql, values, function (err) {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

const getCurrentBidByItemId = (item_id, callback) => {
    const sql = 'SELECT * FROM bids WHERE item_id = ? ORDER BY timestamp DESC LIMIT 1';
    db.get(sql, [item_id], (err, row) => {
        if (err) return callback(err);
        return callback(null, row);
    });
}

module.exports = {
    createItem,
    getCurrentBidByItemId,
    createBid
};