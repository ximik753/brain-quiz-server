module.exports.code = 20102

module.exports.callback = () => {
    return {
        ...game.GameState,
        status: game.status,
        online: clients.length
    }
}
