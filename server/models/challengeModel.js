const mongoose = require("mongoose")
const schema = mongoose.Schema

const Challenges = new schema({
	title: {
		type: String,
		required: true
	},
	starterCode: String,
	content: String,
	test: {type: schema.Types.ObjectId, ref: "tests"},
	language: {
		type: String,
		required: true
	}
	
})

module.exports = mongoose.model("challenges", Challenges)