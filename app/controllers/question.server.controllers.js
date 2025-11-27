const Joi = require('joi');

const get_questions = (req, res) => {
    return res.sendStatus(500);
}

const ask_question = (req, res) => {
    const schema = Joi.object({
    question_text: Joi.string().trim().min(1).required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields
    return res.sendStatus(500);
}

const answer_question = (req, res) => {
    const schema = Joi.object({
    answer_text: Joi.string().trim().min(1).required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields
    return res.sendStatus(500);
}

module.exports = {
    get_questions: get_questions,
    ask_question: ask_question,
    answer_question: answer_question,
}