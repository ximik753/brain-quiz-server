class Game {
    constructor () {
        /*
            0 - ожидание игры
            1 - игра началась, ожидаем челов
            2 - идёт сама игра
        */
        this._status = 0
        this._startTime = 300000
    }

    static get NextGameDate () {
        return new Date('10.19.2020 21:00') / 1000
    }

    start () {
        const id = setInterval(() => {
            this._startTime -= 1000

            if (this._startTime === 0) {
                this.status = 2
                clearInterval(id)
            }
        }, 1000)
    }

    get GameState () {
        switch (this._status) {
        case 1:
            return {
                startTime: this._startTime / 1000
            }
        }
    }
}

module.exports = Game
