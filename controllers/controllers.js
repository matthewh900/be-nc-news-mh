const {selectTopics} = require("../models/models")

exports.getTopics = (req, res) => {
    selectTopics().then((topic) => {
        res.status(200).send({topic})
    })
}