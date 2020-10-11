const { verify } = require('jsonwebtoken')
const { accessTokenSecret } = require('../../../config')
const User = require('../../../db/models/User')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS')
        return next()

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(401)

        const { userId } = verify(token, accessTokenSecret)
        req.user = await User.findById(userId)
        next()
    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации' })
    }
}
