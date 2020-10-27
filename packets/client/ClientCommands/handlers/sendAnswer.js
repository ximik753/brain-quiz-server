module.exports = (session, answer) => {
    if (!session.game.incorrectAnswer) {
        if (game.currentQuestion.rightAnswer !== answer) {
            session.game.incorrectAnswer = game.currentQuestionNumber
        }
    }
}
