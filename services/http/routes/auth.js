const { Router } = require('express')
const User = require('../../../db/models/User')
const { sign } = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const chalk = require('chalk')
require('dotenv').config()

const router = Router()

router.post('/register',
    [
        check('password', 'Некорректный пароль').exists().isLength({ min: 6 }),
        check('name', 'Некорректное имя пользователя').exists().isLength({
            min: 3,
            max: 7
        }),
        check('sex', 'Некорректный пол').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array()[0].msg })

        const { name, password, sex } = req.body

        const prevUser = await User.findOne({ name })
        if (prevUser)
            return res.status(400).json({ error: 'Пользователь с таким логином уже существует' })

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ name, password: hashedPassword, icon: sex })

        try {
            const newUser = await user.save()
            const accessToken = sign({ userId: newUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5y' })

            res.status(201).json({
                response: { token: accessToken }
            })
        } catch (e) {
            console.log(chalk(`Error: ${e.message}`))
        }
    }
)

router.post('/login',
    [
        check('password', 'Некорректный пароль').exists(),
        check('name', 'Некорректный логин').exists().isLength({
            min: 3,
            max: 7
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array()[0].msg })

        const { name, password } = req.body

        const user = await User.findOne({ name })
        if (!user)
            return res.status(400).json({ error: 'Неверный логин или пароль' })

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return res.status(400).json({ error: 'Неверный логин или пароль' })

        const accessToken = sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5y' })
        res.json({
            response: { token: accessToken }
        })
    }
)

module.exports = router
