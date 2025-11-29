const userModel = require('../models/user.server.models');

const isAuthenticated = (req, res, next) => {
    const token = req.header('X-Authorization');
    if (!token) {
        return res.status(401).send('Unauthorised: No token provided');
    }

    userModel.getUserByToken(token, (err, user) => {
        if (err) return res.status(500).send('Database error');
        if (!user) return res.status(401).send('Unauthorised: Invalid token');

        req.user = user;
        next();
    });
};

module.exports = {
    isAuthenticated
};