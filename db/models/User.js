const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
        min: 3,
        max: 7,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    coins: {
        type: Number,
        default: 500
    }
})

module.exports = model('User', userSchema)
