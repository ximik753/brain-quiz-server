const { connect } = require('mongoose')
const chalk = require('chalk')

void (async () => {
    try {
        await connect(process.env.DB_CONNECT, {
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
