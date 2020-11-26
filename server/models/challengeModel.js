const mongoose = require("mongoose")
const schema = mongoose.Schema

const Challenges = new schema({
	content: String,
	test: {type: schema.Types.ObjectId, ref: "tests"},
	language: {
		type: String,
		required: true
	}
	
})

module.exports = mongoose.model("challenges", Challenges)