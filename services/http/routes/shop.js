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
            icon: `http://localhost:3000/images/${booster._doc.icon}.png`
        }
    })
}

router.get('/', auth, async (req, res) => {
    let boosters = await Booster.find({}, { __v: false })
    boosters = transformBoosters(boosters)

    res.json({
        response: [...boosters]
    })
})

router.post('/:id', auth, async (req, res) => {
    try {
        const booster = await Booster.findById(req.params.id)
        req.user.buyBooster(booster)

        res.json({ response: 'ok' })
    } catch (e) {
        res.json({ error: 'Бустер не найден' })
    }
})

module.exports = router
