const Joi = require('joi');

const get_questions = (req, res) => {
    return res.sendStatus(500);
}

const ask_question = (req, res) => {
    const schema = Joi.object({
    question_text: Joi.string().trim().min(1).required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});

    return res.sendStatus(500);
}

const answer_question = (req, res) => {
    const schema = Joi.object({
    answer_text: Joi.string().trim().min(1).required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});
    
    return res.sendStatus(500);
}

module.exports = {
    get_questions: get_questions,
    ask_question: ask_question,
    answer_question: answer_question,
}