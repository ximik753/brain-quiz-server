module.exports.code = 20400

module.exports.callback = ({ answers, title, _id }, currentQuestionNumber) => {
    return { answers, title, id: _id, currentQuestionNumber }
}
