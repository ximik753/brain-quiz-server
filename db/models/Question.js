const { Schema, model } = require('mongoose')

const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    answers: [
        {
            _id: Number,
            text: {
                type: String,
                required: true
            }
        }
    ],
    rightAnswer: {
        type: Number,
        required: true
    },
    complexity: {
        type: Number,
        required: true
    }
})

module.exports = model('Question', questionSchema)
