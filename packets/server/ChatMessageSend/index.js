module.exports.code = 20300

module.exports.callback = ({ name, avatar }, message) => {
    return { name, message, avatar }
}
