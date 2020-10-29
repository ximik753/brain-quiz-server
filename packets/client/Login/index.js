const User = require('../../../db/models/User')
const { verify } = require('jsonwebtoken')

module.exports.code = 10100

const stateGame = {
    connected: true,
    incorrectAnswer: null,
    useBoosterIq: false,
    useExtraLife: false,
    winner: false,
    coins: 0,
    iq: 0
}

module.exports.callback = async (session, { token }) => {
    try {
        const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(userId)

        if (user) {
            session.user = user
            session.game = { ...stateGame }

            clients.push({ ...user, session })
            session.send(packets.HomeData.code, packets.HomeData.callback())
        } else {
            session.send(packets.LoginFailed.code, packets.LoginFailed.payload)
        }
    } catch (e) {
        session.send(packets.LoginFailed.code, packets.LoginFailed.payload)
    }
}
