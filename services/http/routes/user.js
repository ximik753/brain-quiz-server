const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

function transformUserData (user) {
    delete user.__v
    delete user._id
    delete user.password

    return user
}

router.get('/', auth, async (req, res) => {
    const user = transformUserData(req.user._doc)
    res.json({ response: { ...user } })
})

module.exports = router
