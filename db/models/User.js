const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema({
    name: {
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
    avatar: {
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
            booster: {
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

userSchema.methods.buyBooster = async function (booster) {
    const boosters = [...this.boosters]
    const idx = boosters.findIndex(b => b.booster.toString() === booster._id.toString())

    if (booster.cost <= this.coins) {
        if (idx >= 0) {
            boosters[idx].count = boosters[idx].count + 1
        } else {
            boosters.push({
                booster: booster.id,
                count: 1
            })
        }

        this.coins -= booster.cost

        this.boosters = boosters
        await this.save()

        const user = await this.populate('boosters.booster', 'icon title').execPopulate()
        return { boosters: [...user.boosters], coins: user.coins }
    } else {
        return 'Недостаточно средств для покупки'
    }
}

userSchema.methods.useBooster = async function (booster) {
    const boosters = [...this.boosters]
    const idx = boosters.findIndex(b => b.booster.toString() === booster.booster.toString())

    if (boosters[idx].count > 1) {
        boosters[idx].count = boosters[idx].count - 1
    } else {
        boosters.splice(idx, 1)
    }

    this.boosters = boosters
    await this.save()
}

module.exports = model('User', userSchema)
