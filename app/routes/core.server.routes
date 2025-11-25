const core = require("../controllers/core.server.controllers");

module.exports = function(app){
    app.route("/search")
       .get(core.search_item)

    app.route("/item")
       .post(core.create_item)

    app.route("/item/:item_id")
       .get(core.item_details)

    app.route("/item/:item_id/bid")
       .post(core.bid_item)

    app.route("/item/:item_id/bid")
       .get(core.item_bid_history)

}