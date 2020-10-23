const Question = require('../../db/models/Question')
const { green } = require('chalk')

const statusGame = Object.freeze({
    waitGame: 0,
    waitPlayers: 0,
    startQuiz: 0
})

class Game {
    constructor () {
        this._status = statusGame.waitGame
        /*
            стэйт ожидания игроков
        */
        this._startTime = 300000

        /*
            стэйт игры
        */
        this._currentQuestionNumber = 1
        this._totalQuestions = 12
        this._currentQuestionTimer = 10000
        this._currentQuestion = null
        this._questions = []
        this._complexity = 1
    }

    static get NextGameDate () {
        return new Date('10.24.2020 21:00') / 1000
    }

    start () {
        const id = setInterval(() => {
            this._startTime -= 1000

            if (this._startTime === 0) {
                this.status = statusGame.startQuiz
                this._play()
                clearInterval(id)
            }
        }, 1000)
    }

    async _play () {
        this._questions = await Question.find({})
        console.log(green('Quiz Started!'))

        while (this._currentQuestionNumber + 1 !== this._totalQuestions) {
            this._currentQuestion = this._getRandomElementByComplexity(this._complexity)

            this._timer()
            this._mailing(packets.NewQuestion.code, packets.NewQuestion.callback(this._currentQuestion, this._currentQuestionNumber))

            await this._wait(() => console.log('время вышло'), 10000)
            await this._wait(() => this._mailing(packets.RightAnswer.code, packets.RightAnswer.callback(this._currentQuestion)), 1000)
            await this._wait(() => console.log('ожидание нового вопроса'), 3000)
        }
    }

    _wait (callback, ms) {
        return new Promise(resolve => setTimeout(() => {
            callback()
            resolve()
        }, ms))
    }

    _getRandomElementByComplexity (complexity) {
        const arr = this._questions.filter(i => i.complexity === complexity)
        const index = Math.floor(Math.random() * arr.length)
        const element = arr[index]
        this._questions = this._questions.filter(i => element._id !== i._id)

        return element
    }

    _checkComplexity () {
        switch (this._currentQuestionNumber) {
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
                return
            }

            this._currentQuestionNumber += 1
            this._currentQuestionTimer = 10000
            this._checkComplexity()
            clearInterval(id)
        }, 1000)
    }

    _mailing (packetCode, payload) {
        clients.forEach(user => user.session.send(packetCode, payload))
    }

    get GameState () {
        switch (this._status) {
        case statusGame.waitPlayers:
            return {
                startTime: this._startTime / 1000,
                totalQuestion: this._totalQuestions
            }
        case statusGame.startQuiz:
            return {
                currentQuestion: this._currentQuestionTimer,
                currentQuestionNumber: this._currentQuestionNumber,
                totalQuestion: this._totalQuestions
            }
        }
    }
}

module.exports = Game
