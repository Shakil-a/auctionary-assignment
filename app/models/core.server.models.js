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

const getItemDetailsByItemId = (item_id, callback) => {
    const sql = `SELECT 
                items.*,
                creator.first_name AS creator_first_name,
                creator.last_name AS creator_last_name,
                latest_bid.amount AS current_bid,
                bidder.user_id AS current_bid_user_id,
                bidder.first_name AS current_bid_first_name,
                bidder.last_name AS current_bid_last_name
            FROM items
            JOIN users AS creator
                ON items.creator_id = creator.user_id
            LEFT JOIN (
                SELECT *
                FROM bids
                WHERE item_id = ?
                ORDER BY timestamp DESC
                LIMIT 1
            ) AS latest_bid
                ON latest_bid.item_id = items.item_id
            LEFT JOIN users AS bidder
                ON latest_bid.user_id = bidder.user_id
            WHERE items.item_id = ?`;
    db.get(sql, [item_id, item_id], (err, itemDetails) => {
        if (err) return callback(err);
        return callback(null, itemDetails);
    });
}

const getAllBidsByItemId = (item_id, callback) => {
    const sql = 'SELECT bids.item_id, bids.amount, bids.timestamp, bids.user_id, bidder.first_name, bidder.last_name FROM bids JOIN users as bidder ON bids.user_id = bidder.user_id WHERE bids.item_id = ? ORDER BY bids.timestamp DESC';
    db.all(sql, [item_id], (err, bids) => {
        if (err) return callback(err);
        return callback(null, bids);
    });
}

const searchItems = (q, status, userId, limit, offset, callback) => {
    let sql = `
        SELECT DISTINCT
            items.item_id,
            items.name,
            items.description,
            items.end_date,
            items.creator_id,
            u.first_name,
            u.last_name
        FROM items
        JOIN users u ON items.creator_id = u.user_id
    `;

    const where = [];
    const values = [];

    if (q) {
        where.push(`items.name LIKE ?`);
        values.push(`%${q}%`);
    }

    if (status === 'OPEN') {
        where.push(`items.creator_id = ?`);
        where.push(`items.end_date > strftime('%s','now')`);
        values.push(userId);
    }

    if (status === 'ARCHIVE') {
        where.push(`items.creator_id = ?`);
        where.push(`items.end_date < strftime('%s','now')`);
        values.push(userId);
    }

    if (status === 'BID') {
        sql += ` JOIN bids ON bids.item_id = items.item_id `;
        where.push(`bids.user_id = ?`);
        values.push(userId);
    }

    if (where.length > 0) {
        sql += ` WHERE ` + where.join(' AND ');
    }

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    db.all(sql, values, (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
    });
};

module.exports = {
    createItem,
    getCurrentBidByItemId,
    createBid,
    getItemByItemId,
    getItemDetailsByItemId,
    getAllBidsByItemId,
    searchItems
};