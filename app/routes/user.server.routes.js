const users = require("../controllers/user.server.controllers");
const { isAuthenticated } = require('../middleware/auth.middleware');

module.exports = function(app){
    app.route("/users")
       .post(users.create_account)

    app.route("/login")
       .post(users.login)

    app.route("/logout")
       .post(isAuthenticated, users.logout)

    app.route("/users/:user_id")
       .get(users.get_profile_information)
}