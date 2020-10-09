const { Router } = require('express')
const User = require('../../../db/models/User')
const { sign } = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const { accessTokenSecret } = require('../../../config')
const chalk = require('chalk')

const router = Router()

router.post('/register',
    [
        check('password', 'Некорректный пароль').exists().isLength({ min: 6 }),
        check('login', 'Некорректное имя пользователя').exists().isLength({
            min: 3,
            max: 7
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array()[0].msg })

        const { login, password } = req.body

        const prevUser = await User.findOne({ login })
        if (prevUser)
            return res.status(400).json({ error: 'Пользователь с таким логином уже существует' })

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ login, password: hashedPassword })

        try {
            const newUser = await user.save()
            res.status(201).json({
                response: { id: newUser.id }
            })
        } catch (e) {
            console.log(chalk(`Error: ${e.message}`))
        }
    }
)

router.post('/login',
    [
        check('password', 'Некорректный пароль').exists(),
        check('login', 'Некорректный логин').exists().isLength({
            min: 3,
            max: 7
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array()[0].msg })

        const { login, password } = req.body

        const user = await User.findOne({ login })
        if (!user)
            return res.status(400).json({ error: 'Неверный логин или пароль' })

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return res.status(400).json({ error: 'Неверный логин или пароль' })

        const accessToken = sign({ userId: user.id }, accessTokenSecret, { expiresIn: '5y' })
        await User.findOneAndUpdate(user.id, { token: accessToken })
        res.json({
            response: { token: accessToken }
        })
    }
)

module.exports = router
