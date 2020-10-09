const { Schema, model } = require('mongoose')

const boosterSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    }
})

module.exports = model('Booster', boosterSchema)
