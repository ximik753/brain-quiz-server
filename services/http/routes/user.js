const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const { check, validationResult } = require('express-validator')

function transformUserData (user) {
    delete user.__v
    delete user._id
    delete user.password

    user.boosters = user.boosters.map(booster => {
        booster.booster.icon = `https://brain-quiz-server.herokuapp.com/images/${booster.booster.icon}.png`
        return booster
    })

    user.nextGameDate = Date.parse(new Date(nextGameDate.nextInvocation()).toString()) / 1000

    if (game.status === 1) {
        user.status = game.status
    }

    return user
}

router.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate('boosters.booster', 'icon title')
        .execPopulate()

    const dataTransformed = transformUserData(user._doc)
    res.json({ response: { ...dataTransformed } })
})

router.post('/editAvatar',
    auth,
    [
        check('avatar', 'Некорректный Id аватара').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array()[0].msg })

        await req.user.updateOne(req.body)
        res.json({ response: 'ok' })
    })

module.exports = router
