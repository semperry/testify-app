const mongoose = require("mongoose")
const schema = mongoose.Schema

const Tests = new schema({
	content: String,
	challenge: {type: schema.Types.ObjectId, ref: "challenges"},

})

module.exports = mongoose.model("tests", Tests)