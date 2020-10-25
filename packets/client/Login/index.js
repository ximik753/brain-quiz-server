const User = require('../../../db/models/User')
const { verify } = require('jsonwebtoken')

module.exports.code = 10100

module.exports.callback = async (session, { token }) => {
    const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(userId)

    if (user) {
        session.user = user
        clients.push({ ...user, session })
        session.send(packets.HomeData.code, packets.HomeData.callback())
    } else {
        session.send(packets.LoginFailed.code, packets.LoginFailed.payload)
    }
}
