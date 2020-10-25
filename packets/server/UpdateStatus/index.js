module.exports.code = 20402

module.exports.callback = (status, state) => {
    return { id: status, ...state }
}
