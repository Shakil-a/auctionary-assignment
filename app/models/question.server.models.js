const db = require('../../database');


const askQuestion = (question_text, user_id, item_id, callback) => {
    const sql = 'INSERT INTO questions(question, asked_by, item_id) VALUES (?, ?, ?)';
    const values = [question_text, user_id, item_id];

    db.run(sql, values, function (err) {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

module.exports = {
    askQuestion
};