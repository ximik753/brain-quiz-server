const boosterIqBooster = '5f809d93a45be03a7c248b98'

module.exports = async session => {
    if (game.status === 1 && !session.game.useBoosterIq) {
        const booster = session.user.boosters.find(item => item.booster.toString() === boosterIqBooster)

        if (booster) {
            session.game.useBoosterIq = true
            await session.user.useBooster(booster)
        }
    }
}
