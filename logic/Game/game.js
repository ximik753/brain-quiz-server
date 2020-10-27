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
        this._currentQuestionTimer = 10000
        this.currentQuestion = null
        this._questions = []
        this._complexity = 1
    }

    start () {
        this.status = statusGame.waitPlayers

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
        console.log(green('Quiz start!'))

        while (this.currentQuestionNumber !== this._totalQuestions + 1) {
            this.currentQuestion = this._getRandomElementByComplexity(this._complexity)

            this._timer()
            this._mailing(packets.NewQuestion.code, packets.NewQuestion.callback(this.currentQuestion, this.currentQuestionNumber))

            await this._wait(() => console.log('время вышло'), 10)
            await this._wait(() => this._mailing(packets.RightAnswer.code, packets.RightAnswer.callback(this.currentQuestion)), 1)
            await this._wait(() => {
                this.currentQuestionNumber += 1
                this._currentQuestionTimer = 10000
                this._checkComplexity()
            }, 4)
        }

        this.status = statusGame.endingQuiz
        this._updateStatus()

        await this._wait(() => {
            this.status = statusGame.waitGame
            this._updateStatus()
        }, 10)

        console.log(green('Quiz end!'))
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

            this._currentQuestionNumber += 1
            this._currentQuestionTimer = 10000
            this._checkComplexity()
            clearInterval(id)
        }, 1000)
    }

    _updateStatus () {
        this._mailing(packets.UpdateStatus.code, packets.UpdateStatus.callback(this.status, this.GameState))
    }

    _mailing (packetCode, payload) {
        clients.forEach(user => user.session.send(packetCode, payload))
    }

    get GameState () {
        switch (this.status) {
        case statusGame.waitPlayers:
            return {
                startTime: this._startTime / 1000
            }
        case statusGame.startQuiz:
            return {
                totalQuestions: this._totalQuestions
            }
        }
    }
}

module.exports = Game
