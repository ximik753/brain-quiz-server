const Chat = require('../../../../logic/Chat/chat')

module.exports = (session, message) => Chat.sendMessage(session, message)
