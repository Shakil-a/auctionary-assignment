const Joi = require('joi');
const crypto = require('crypto');
const userModel = require('../models/user.server.models');

const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

const create_account = (req, res) => {
    const schema = Joi.object({
    first_name: Joi.string().trim().min(1).required(),
    last_name: Joi.string().trim().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .max(32)
        .regex(/[0-9]/, 'numbers')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
        .regex(/[A-Z]/, 'upper case')
        .regex(/[a-z]/, 'lower case')
        .required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});

    userModel.getUserByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).json({ error_message: "Database error" });
        if (user) return res.status(400).json({ error_message: "Email already exists" });

        const salt = crypto.randomBytes(64);
        const hash = getHash(req.body.password, salt);

        userModel.createUser(
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hash,
            salt.toString('hex'),
            (err, userId) => {
                if (err) return res.status(500).send('Database error');

                const token = crypto.randomBytes(16).toString('hex');

                userModel.setToken(userId, token, (err2) => {
                    if (err2) return res.status(500).send('Database error');

                    userModel.getUserByEmail(req.body.email, (err3, updatedUser) => {
                        if (err3) return res.status(500).send('Database error');
                        res.status(201).send({
                            user_id: updatedUser.user_id,
                            session_token: updatedUser.session_token
                        });
                    });
                });
            }
        );
    });

};

const login = (req, res) => {
    const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
    })
    .options({ stripUnknown: false });   //FAIL on extra fields

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send({'error_message' :error.details[0].message});

    userModel.getUserByEmail(req.body.email, (err, user) => {
        if (err) {
            return res.status(500).send('Database error. first one');
        }

        if (!user) return res.status(400).send('Invalid email or password');

        const salt = Buffer.from(user.salt, 'hex');
        const hash = getHash(req.body.password, salt);

        if (hash !== user.password) return res.status(400).send({'error_message': 'password is wrong'});

        if (user.session_token) return res.status(200).send({ message: 'Already logged in', user_id: user.user_id, session_token: user.session_token });

        const token = crypto.randomBytes(16).toString('hex');
        userModel.setToken(user.user_id, token, (err2) => {
            console.log(err2);
            if (err2) return res.status(500).send('Database error');
            return res.status(200).send({ 'user_id': user.user_id, 'session_token': token });
        });
    });
}

const logout = (req, res) => {
    const token = req.header('X-Authorization');

    userModel.deleteToken(token, (err) => {
        if (err) return res.status(500).send('Database error');
        res.status(200).send({ message: 'Logged out' });
    });
}

const get_profile_information = (req, res) => {
    return res.sendStatus(500);
}

module.exports = {
    create_account: create_account,
    login: login,
    logout: logout,
    get_profile_information: get_profile_information
}