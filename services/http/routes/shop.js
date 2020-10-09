const { Router } = require('express')
const Booster = require('../../../db/models/Booster')
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

router.get('/', async (req, res) => {
    let boosters = await Booster.find({}, { __v: false })
    boosters = transformBoosters(boosters)

    res.json({
        response: [...boosters]
    })
})

router.post('/:id', async (req, res) => {})

module.exports = router
