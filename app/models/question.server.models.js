const db = require('../../database');


const askQuestion = (question_text, user_id, item_id, callback) => {
    const sql = 'INSERT INTO questions(question, asked_by, item_id) VALUES (?, ?, ?)';
    const values = [question_text, user_id, item_id];

    db.run(sql, values, function (err) {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

const getQuestionById = (id, callback) => {
    const sql = 'SELECT * FROM questions WHERE question_id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) return callback(err);
        return callback(null, row);
    });
};

const answerQuestionByQuestionId = (answer, id, callback) => {
    const sql = 'UPDATE questions SET answer = ? WHERE question_id = ?';;
    const values = [answer, id];
    db.run(sql, values, (err) => {
        if (err) return callback(err);
        return callback(null, this.lastID);
    });
};

module.exports = {
    askQuestion,
    getQuestionById,
    answerQuestionByQuestionId
};