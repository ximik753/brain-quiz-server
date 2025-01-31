const { Router } = require('express')
const Booster = require('../../../db/models/Booster')
const auth = require('../middleware/auth.middleware')
const router = Router()

function transformBoosters (boosters) {
    return boosters.map(booster => {
        booster._doc.id = booster._doc._id
        delete booster._doc._id

        return {
            ...booster._doc,
            icon: `https://brain-quiz-server.herokuapp.com/images/${booster._doc.icon}.png`
        }
    })
}

function transformBuyData (data) {
    data.boosters = data.boosters.map(booster => {
        booster.booster = {
            title: booster.booster._doc.title,
            icon: `https://brain-quiz-server.herokuapp.com/images/${booster.booster._doc.icon}.png`
        }

        return booster
    })

    return data
}

router.get('/', auth, async (req, res) => {
    let boosters = await Booster.find({ enabled: true }, { __v: false })
    boosters = transformBoosters(boosters)

    res.json({
        response: [...boosters]
    })
})

router.post('/:id', auth, async (req, res) => {
    try {
        const booster = await Booster.findById(req.params.id)
        let data = await req.user.buyBooster(booster)

        if (typeof data === 'object') {
            data = transformBuyData(data)
            res.json({ response: { ...data } })
        } else {
            res.status(400).json({ error: data })
        }
    } catch (e) {
        res.status(400).json({ error: 'Бустер не найден' })
    }
})

module.exports = router
