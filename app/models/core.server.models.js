const db = require('../../database');

const createItem = (name, description, starting_bid, end_date, creator_id, callback) => {
    const sql = 'INSERT INTO items(name, description, starting_bid, end_date, creator_id) VALUES (?, ?, ?, ?, ?)';
    const values = [name, description, starting_bid, end_date, creator_id];

    db.run(sql, values, function (err) {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

const createBid = (item_id, user_id, amount, timestamp, callback) => {
    const sql = 'INSERT INTO bids(item_id, user_id, amount, timestamp) VALUES (?, ?, ?, ?)';
    const values = [item_id, user_id, amount, timestamp];

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

const getItemByItemId = (item_id, callback) => {
    const sql = 'SELECT * FROM items WHERE item_id = ?';
    db.get(sql, [item_id], (err, item) => {
        if (err) return callback(err);
        return callback(null, item);
    });
}



module.exports = {
    createItem,
    getCurrentBidByItemId,
    createBid,
    getItemByItemId
};