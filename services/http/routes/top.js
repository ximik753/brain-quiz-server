const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const User = require('../../../db/models/User')
const router = Router()

router.get('/', auth, async (req, res) => {
    const user = await User.find({}, { name: true, avatar: true, 'stats.iq': true, _id: false })
        .sort({ 'stats.iq': -1 })
        .limit(100)

    res.json({ response: [...user] })
})

module.exports = router
