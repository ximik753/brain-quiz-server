class Chat {
    static sendMessage (session, message) {
        clients.forEach(user => {
            user.session.send(packets.ChatMessageSend.code, packets.ChatMessageSend.callback(session.user, message.message))
        })
    }
}

module.exports = Chat
