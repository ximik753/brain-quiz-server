module.exports.code = 20401

module.exports.callback = ({ rightAnswer, _id }) => {
    return { id: rightAnswer, questionId: _id }
}
