const express = require('express')
const { portHttpServer } = require('../../config')
const chalk = require('chalk')
const authRoute = require('./routes/auth')

const app = express()
app.use(express.json())

app.use('/api/auth', authRoute)

const PORT = portHttpServer || 3000

app.listen(PORT, () => console.log(chalk.green(`✔ HTTP server listening on port ${PORT}`)))
