const Joi = require('joi');

const search_item = (req, res) => {
    return res.sendStatus(500);
}

const create_item = (req, res) => {
    const schema = Joi.object({
    name: Joi.string().trim().min(1).required(),
    description: Joi.string().trim().min(1).required(),
    starting_bid: Joi.number().min(0).required(),
    end_date: Joi.date().greater('now').required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});

    return res.sendStatus(500);
}

const item_details = (req, res) => {
    return res.sendStatus(500);
}

const bid_item = (req, res) => {
    const schema = Joi.object({
    amount: Joi.number().min(0).required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});
    
    return res.sendStatus(500);
}

const item_bid_history = (req, res) => {
    return res.sendStatus(500);
}

module.exports = {
    search_item: search_item,
    create_item: create_item,
    item_details: item_details,
    bid_item: bid_item,
    item_bid_history: item_bid_history
}