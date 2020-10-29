module.exports = (session, answer) => {
    if (!session.game.incorrectAnswer) {
        if (game.currentQuestion.rightAnswer !== answer) {
            session.game.incorrectAnswer = game.currentQuestionNumber
        }

        if (game.currentQuestionNumber === game._totalQuestions) {
            session.game.winner = true
        }
    }

    if (game.currentQuestionNumber === game._totalQuestions) {
        if (!session.game.incorrectAnswer) {
            session.game.winner = true
        }
    }
}
