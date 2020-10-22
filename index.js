require('./services/http')
require('./db')
const chalk = require('chalk')
const Session = require('./packets/session')
const fs = require('fs')
const WebSocket = require('ws')

const ws = new WebSocket.Server({ port: 8080 })

packets = {}
clients = []

fs.readdir('./packets/client', (err, files) => {
    if (err) {
        return console.log(chalk.red(err.messages))
    }

    files.forEach(file => {
        const packet = require(`./packets/client/${file}`)
        packets[packet.code] = packet
        packets[file] = packet
    })

    fs.readdir('./packets/server', (err, files) => {
        if (err) {
            return console.log(chalk.red(err.messages))
        }

        files.forEach(file => {
            const packet = require(`./packets/server/${file}`)
            packets[packet.code] = packet
            packets[file] = packet
        })
    })
})

ws.on('connection', client => {
    console.log(chalk.blue('[SERVER] Client connected'))
    client.session = new Session(client)

    client.on('message', message => {
        const { id, payload } = JSON.parse(message)

        console.log(chalk.blue(`[SERVER] Received message ${id}`))
        client.session.parse(id, payload)
    })

    client.on('close', client => {
        console.log(chalk.blue('[SERVER] Client disconnected'))
    })
})

console.log(chalk.green('[SERVER] Listening on 8080'))
