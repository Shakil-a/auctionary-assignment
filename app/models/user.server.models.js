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

const getUserProfileById = (user_id, callback) => {
    const now = Date.now();

    db.get('SELECT user_id, first_name, last_name FROM users WHERE user_id = ?', [user_id], (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(null, null);

        const profile = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            selling: [],
            bidding_on: [],
            auctions_ended: []
        };

        const sellingSql = `
            SELECT i.*, u.first_name, u.last_name
            FROM items i
            JOIN users u ON i.creator_id = u.user_id
            WHERE i.creator_id = ?
        `;
        db.all(sellingSql, [user_id], (err, selling) => {
            if (err) return callback(err);
            profile.selling = selling;

            const biddingSql = `
                SELECT DISTINCT i.*, u.first_name, u.last_name
                FROM bids b
                JOIN items i ON b.item_id = i.item_id
                JOIN users u ON i.creator_id = u.user_id
                WHERE b.user_id = ?
            `;
            db.all(biddingSql, [user_id], (err, bidding_on) => {
                if (err) return callback(err);
                profile.bidding_on = bidding_on;

                const auctionsEndedSql = `
                    SELECT DISTINCT i.*, u.first_name, u.last_name
                    FROM items i
                    JOIN users u ON i.creator_id = u.user_id
                    WHERE i.end_date < ?
                      AND (i.creator_id = ? OR i.item_id IN (SELECT item_id FROM bids WHERE user_id = ?))
                `;
                db.all(auctionsEndedSql, [now, user_id, user_id], (err, auctions_ended) => {
                    if (err) return callback(err);
                    profile.auctions_ended = auctions_ended;

                    callback(null, profile);
                });
            });
        });
    });
};

module.exports = {
    createUser,
    getUserByEmail,
    setToken,
    getUserByToken,
    deleteToken,
    getUserById,
    getUserProfileById
};