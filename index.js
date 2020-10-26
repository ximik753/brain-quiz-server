require('./db')
const chalk = require('chalk')
const Session = require('./packets/session')
const fs = require('fs')
const { Server } = require('ws')
const Game = require('./logic/Game/game')
const http = require('http')
const express = require('express')
const schedule = require('node-schedule')

app = express()
const server = http.createServer(app)
const ws = new Server({ server })
require('./services/http')

packets = {}
clients = []
game = new Game()

schedule.scheduleJob(new Date('10.26.2020 18:35'), () => {
    game.start()
})

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

const PORT = process.env.PORT || 8080
server.listen(PORT, () => console.log(chalk.green(`[SERVER] Listening on ${PORT}`)))
