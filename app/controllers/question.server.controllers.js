const Joi = require('joi');
const coreModel = require('../models/core.server.models');
const questionModel = require('../models/question.server.models');

const get_questions = (req, res) => {
    const item_id = parseInt(req.params.item_id);
    coreModel.getItemByItemId(
        item_id, (err, item) => {
            if (err) return res.status(500).send("Database error");
            if(!item) return res.status(404).send("item does not exist");

            questionModel.getAllQuestionsByItemId(
                item_id, (err2, questions) => {
                    if (err2) return res.status(500).send("Database error");
                    return res.status(200).json(questions);
                }
            )

        }
    )

}

const ask_question = (req, res) => {
    const item_id = parseInt(req.params.item_id);
    const user_id = req.user.user_id;    
    const schema = Joi.object({question_text: Joi.string().trim().min(1).required()})

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});

    
    coreModel.getItemByItemId(item_id, (err, item) => {
            if (err) return res.status(500).send("Database error");
            if(!item) return res.status(404).send("item does not exist");
    
            if(item.creator_id === user_id) return res.status(403).send('cannot ask on own item');

            questionModel.askQuestion(
                req.body.question_text,
                user_id,
                item.item_id,
                (err, question_id) => {
                    if (err) return res.status(500).send('Database error');
                    res.status(200).send({ 'question_id': question_id });
                }
            )
    
        });
}

const answer_question = (req, res) => {
    const question_id = parseInt(req.params.question_id);
    const user_id = req.user.user_id;
    const schema = Joi.object({answer_text: Joi.string().trim().min(1).required()})
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});

    questionModel.getQuestionById(question_id, (err, question) => {
        if (err) return res.status(500).send('Database error');
        if (!question) return res.status(404).send('no question found');

        coreModel.getItemByItemId(question.item_id, (err2, item) => {
            if (err2) return res.status(500).send('Database error');
            if (!item) return res.status(500).send('Item missing');

            if (item.creator_id !== user_id) {
                return res.status(403).send('cannot answer a question you did not create');
            }

            questionModel.answerQuestionByQuestionId(
                req.body.answer_text,
                question_id,
                (err3) => {
                    if (err3) return res.status(500).send('Database error');
                    return res.status(200).send('answered question');
                }
            );
        });
    });
}



module.exports = {
    get_questions: get_questions,
    ask_question: ask_question,
    answer_question: answer_question,
}