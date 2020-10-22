const Question = require('../../../db/models/Question')
const auth = require('../middleware/auth.middleware')
const { Router } = require('express')

const router = Router()

router.post('/', auth, async (req, res) => {
    const { title, answers, complexity, rightAnswer } = req.body

    try {
        const answersTransform = answers.map((answer, index) => {
            answer._id = Date.now() + index
            return answer
        })

        await new Question({
            title,
            answers: answersTransform,
            rightAnswer: answersTransform[rightAnswer]._id,
            complexity
        }).save()

        res.json({ response: 'ok' })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
})

module.exports = router
