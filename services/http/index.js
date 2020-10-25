const express = require('express')
const chalk = require('chalk')
const authRoute = require('./routes/auth')
const cors = require('cors')
const shopRoute = require('./routes/shop')
const userRoute = require('./routes/user')
const topRoute = require('./routes/top')
const questionRoute = require('./routes/question')
const path = require('path')

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoute)
app.use('/api/shop', shopRoute)
app.use('/api/user', userRoute)
app.use('/api/top', topRoute)
app.use('/api/question', questionRoute)
app.use('/images', express.static(path.join(__dirname, 'images')))

const PORT = process.env.PORT || 3000

console.log(chalk.green(`✔ HTTP server listening on port ${PORT}`))
