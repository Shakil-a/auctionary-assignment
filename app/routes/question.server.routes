const questions = require("../controllers/question.server.controllers");

module.exports = function(app){
    app.route("/item/:item_id/question")
       .get(questions.get_questions)

    app.route("/item/:item_id/question")
       .post(questions.ask_question)

    app.route("/question/:question_id")
       .post(questions.answer_question)
}