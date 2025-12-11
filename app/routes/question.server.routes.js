const questions = require("../controllers/question.server.controllers");
const { isAuthenticated } = require('../middleware/auth.middleware');

module.exports = function(app){
    app.route("/item/:item_id/question")
       .get(questions.get_questions)

    app.route("/item/:item_id/question")
       .post(isAuthenticated, questions.ask_question)

    app.route("/question/:question_id")
       .post(isAuthenticated, questions.answer_question)
}