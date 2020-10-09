const { connect } = require('mongoose')
const { dbConnect } = require('../config')
const chalk = require('chalk')

void (async () => {
    try {
        await connect(dbConnect, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        console.log(chalk.green('✔ Successfully connected to the DB'))
    } catch (e) {
        console.log(chalk.red(`✖ Could not connect to database! Error: ${e.message}`))
        process.exit(1)
    }
})()
