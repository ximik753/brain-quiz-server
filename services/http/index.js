const express = require('express')
const chalk = require('chalk')
const authRoute = require('./routes/auth')
const shopRoute = require('./routes/shop')
const userRoute = require('./routes/user')
const path = require('path')

const app = express()
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/shop', shopRoute)
app.use('/api/user', userRoute)
app.use('/images', express.static(path.join(__dirname, 'images')))

const PORT = process.env.PORT_HTTP_SERVER || 3000

app.listen(PORT, () => console.log(chalk.green(`✔ HTTP server listening on port ${PORT}`)))
