class Session {
    constructor (client) {
        this.client = client
    }

    send (id, payload = {}) {
        this.client.send(JSON.stringify({ id, payload }))
    }

    parse (code, data) {
        if (packets[code]) {
            if (typeof packets[code].callback === 'function')
                packets[code].callback(this, data)
        }
    }
}

module.exports = Session
