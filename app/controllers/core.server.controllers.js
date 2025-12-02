const Joi = require('joi');
const coreModel = require('../models/core.server.models');

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

    coreModel.createItem(
        req.body.name,
        req.body.description,
        req.body.starting_bid,
        req.body.end_date,
        (err, itemId) => {
            if (err) return res.status(500).send('Database error');
            res.status(201).send({'item_id': itemId})
        }
    )
}

const item_details = (req, res) => {
    return res.sendStatus(500);
}

const bid_item = (req, res) => {
    const item_id = parseInt(req.params.item_id);
    const user_id = req.user.user_id;

    const schema = Joi.object({
    amount: Joi.number().min(0).required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});

    coreModel.getCurrentBidByItemId(item_id, (err, bid) => {
        if (err) return res.status(500).send("Database error");

        if (bid && req.body.amount <= bid.amount) {
            return res.status(400).send("amount less or equal than current bid");
        }

        coreModel.createBid(item_id, user_id, req.body.amount, (err, bid_id) => {
            if (err) return res.status(500).send('Database error');

            res.status(201).send({ 'bid_id': bid_id });
        });
    });
    
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