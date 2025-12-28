const core = require("../controllers/core.server.controllers");
const { isAuthenticated } = require('../middleware/auth.middleware');

module.exports = function(app){
    app.route("/search")
       .get(core.search_item)

    app.route("/item")
       .post(isAuthenticated, core.create_item)

    app.route("/item/:item_id")
       .get(core.item_details)

    app.route("/item/:item_id/bid")
       .post(isAuthenticated, core.bid_item)

    app.route("/item/:item_id/bid")
       .get(core.item_bid_history)

}