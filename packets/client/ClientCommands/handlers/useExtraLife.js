const extraLifeBooster = '5f84053fe483452d447c8d2f'

module.exports = async session => {
    console.log(session.game.incorrectAnswer, game.currentQuestionNumber)
    if (!session.game.useExtraLife && session.game.incorrectAnswer === game.currentQuestionNumber) {
        const booster = session.user.boosters.find(item => item.booster.toString() === extraLifeBooster)

        if (booster) {
            session.game.useExtraLife = true
            session.game.incorrectAnswer = null
            await session.user.useBooster(booster)
        }
    }
}
