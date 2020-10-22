module.exports.code = 20102

module.exports.payload = {
    get online () {
        return clients.length
    },
    ...game.GameState
}
