const handlers = {
    100: require('./handlers/online'),
    200: require('./handlers/chatMessage')
}

module.exports.code = 10200

module.exports.callback = (session, { id, data }) => handlers[id](session, data)
