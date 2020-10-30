const Question = require('../../db/models/Question')
const { green } = require('chalk')

const statusGame = Object.freeze({
    waitGame: 0,
    waitPlayers: 1,
    startQuiz: 2,
    endingQuiz: 3
})

class Game {
    constructor () {
        this.status = statusGame.waitGame
        /*
            стэйт ожидания игроков
        */
        this._startTime = 300000

        /*
            стэйт игры
        */
        this.currentQuestionNumber = 1
        this._totalQuestions = 12
        this.currentQuestion = null
        this._questions = []
        this._complexity = 1

        /*
            стэйт расчёта iq
        */
        this.coefficientIQ = 10
        this.coefficientCoins = 5
    }

    async start () {
        console.log(green('[QUIZ] wait players!'))
        await this._wait(() => {
            this.status = statusGame.waitPlayers
        }, 1)

        const id = setInterval(async () => {
            this._startTime -= 1000

            if (this._startTime === 0) {
                this.status = statusGame.startQuiz

                this._updateStatus()
                await this._wait(() => {
                    this._play()
                    clearInterval(id)
                }, 1)
            }
        }, 1000)
    }

    async _play () {
        this._questions = await Question.find({})
        console.log(green('[QUIZ] start!'))

        while (this.currentQuestionNumber !== this._totalQuestions + 1) {
            this.currentQuestion = this._getRandomElementByComplexity(this._complexity)

            this._timer()
            this._mailing(packets.NewQuestion.code, packets.NewQuestion.callback(this.currentQuestion, this.currentQuestionNumber))

            await this._wait(() => console.log(green('[QUIZ] send answers')), 10)
            await this._wait(() => this._mailing(packets.RightAnswer.code, packets.RightAnswer.callback(this.currentQuestion)), 1)
            await this._wait(() => {
                this.currentQuestionNumber += 1
                this.coefficientIQ += Math.trunc(this.coefficientIQ * 1.15)
                this.coefficientCoins += 1
                this._checkComplexity()
            }, 4)
        }

        await this._end()
    }

    async _end () {
        this.status = statusGame.endingQuiz
        this._updateStatus()

        this._mailing(packets.GameWinners.code, packets.GameWinners.callback(this._getWinners()))
        await this._updateUserData()

        await this._wait(() => {
            this.status = statusGame.waitGame
            this._updateStatus()
        }, 10)

        console.log(green('[QUIZ] end!'))
    }

    async _updateUserData () {
        for (const client of clients) {
            const { coins, iq } = client.session.game
            await client.session.user.updateOne({ coins, $inc: { 'stats.iq': iq } })
        }
    }

    _wait (callback, sec) {
        return new Promise(resolve => setTimeout(() => {
            callback()
            resolve()
        }, sec * 1000))
    }

    _getRandomElementByComplexity (complexity) {
        const arr = this._questions.filter(i => i.complexity === complexity)
        const index = Math.floor(Math.random() * arr.length)
        const element = arr[index]
        this._questions = this._questions.filter(i => element._id !== i._id)

        return element
    }

    _checkComplexity () {
        switch (this.currentQuestionNumber) {
        case 5:
            this._complexity = 2
            break
        case 9:
            this._complexity = 3
            break
        }
    }

    _timer () {
        const id = setInterval(() => {
            if (this._currentQuestionTimer > 0) {
                this._currentQuestionTimer -= 1000
                return null
            }

            clearInterval(id)
        }, 1000)
    }

    _updateStatus () {
        this._mailing(packets.UpdateStatus.code, packets.UpdateStatus.callback(this.status, this.GameState))
    }

    _mailing (packetCode, payload) {
        clients.forEach(user => user.session.send(packetCode, payload))
    }

    _getWinners () {
        return clients
            .filter(client => client.session.game.winner)
            .map(client => {
                const { name, avatar } = client.session.user
                return { name, avatar }
            })
    }

    get GameState () {
        switch (this.status) {
        case statusGame.waitPlayers:
            return {
                startTime: this._startTime / 1000,
                totalQuestions: this._totalQuestions
            }
        }
    }
}

module.exports = Game
