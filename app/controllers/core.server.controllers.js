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
        req.user.user_id,
        (err, itemId) => {
            if (err) return res.status(500).send('Database error');
            res.status(201).send({'item_id': itemId})
        }
    )
}

const item_details = (req, res) => {
    const item_id = parseInt(req.params.item_id);

    coreModel.getItemByItemId(item_id, (err, item) => {
        if (err) return res.status(500).send("Database error");
        if(!item) return res.status(404).send("item does not exist");

        coreModel.getItemDetailsByItemId(item_id, (err, itemDetails) => {
            if (err) return res.status(500).send("Database error");
            const formattedItemDetails = {
                "item_id": itemDetails.item_id,
                "name": itemDetails.name,
                "description": itemDetails.description,
                "starting_bid": itemDetails.starting_bid,
                "start_date": itemDetails.start_date,
                "end_date": itemDetails.end_date,
                "creator_id": itemDetails.creator_id,
                "first_name": itemDetails.creator_first_name,
                "last_name": itemDetails.creator_last_name,
                "current_bid": itemDetails.current_bid ? itemDetails.current_bid : itemDetails.starting_bid,
                "current_bid_holder": itemDetails.current_bid_user_id ? {
                    "user_id": itemDetails.current_bid_user_id,
                    "first_name": itemDetails.current_bid_first_name,
                    "last_name": itemDetails.current_bid_last_name,

                } : null,
                
            }
            return res.status(200).send(formattedItemDetails);
        })
        

    })

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

    coreModel.getItemByItemId(item_id, (err, item) => {
        if (err) return res.status(500).send("Database error");
        if(!item) return res.status(404).send("item does not exist");

        if(item.creator_id === user_id) return res.status(403).send('cannot bid on own item');

        coreModel.getCurrentBidByItemId(item_id, (err, currentBid) => {
            if (err) return res.status(500).send('Database error');

            const bidAmount = Number(req.body.amount);
            const currentAmount = currentBid ? Number(currentBid.amount) : 0;

            if(bidAmount <= currentAmount) return res.status(400).send({ 'error_message': `Bid must be higher than current bid (${currentAmount})`});

            coreModel.createBid(item_id, user_id, req.body.amount, new Date(), (err, bid) => {
                if (err) return res.status(500).send('Database error');

                res.status(201).send({ 'bid_id': bid });
            });
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