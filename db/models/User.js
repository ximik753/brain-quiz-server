const { Schema, model, Types } = require('mongoose')

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
    coins: {
        type: Number,
        default: 500
    },
    icon: {
        type: Number,
        required: true
    },
    boosters: [
        {
            count: {
                type: Number,
                required: true,
                default: 0
            },
            boosterId: {
                type: Types.ObjectId,
                ref: 'Booster',
                required: true
            }
        }
    ],
    stats: {
        gameTotal: {
            type: Number,
            default: 0
        },
        gameWinner: {
            type: Number,
            default: 0
        },
        iq: {
            type: Number,
            default: 0
        }
    }
})

userSchema.methods.buyBooster = function (booster) {
    const boosters = [...this.boosters]
    const idx = boosters.findIndex(b => b.boosterId.toString() === booster._id.toString())

    if (idx >= 0) {
        boosters[idx].count = boosters[idx].count + 1
    } else {
        boosters.push({
            boosterId: booster.id,
            count: 1
        })
    }

    this.boosters = boosters
    return this.save()
}

module.exports = model('User', userSchema)
