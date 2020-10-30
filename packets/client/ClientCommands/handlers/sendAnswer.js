module.exports = (session, answer) => {
    if (!session.game.incorrectAnswer) {
        if (game.currentQuestion.rightAnswer !== answer.id) {
            session.game.incorrectAnswer = game.currentQuestionNumber
        }
    }

    if (!session.game.incorrectAnswer) {
        session.game.iq += session.game.useBoosterIq
            ? Math.trunc(game.coefficientIQ * 1.15)
            : game.coefficientIQ

        if (game.currentQuestionNumber === game._totalQuestions) {
            session.game.winner = true
        }
    }

    if (game.currentQuestion.rightAnswer === answer.id) {
        session.game.coins += game.coefficientCoins
    }
}
