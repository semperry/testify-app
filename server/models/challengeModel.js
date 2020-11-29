const mongoose = require("mongoose")
const schema = mongoose.Schema

const Challenges = new schema({
	title: {
		type: String,
		required: true
	},
	starterCode: String,
	content: String,
	test: {
		content: String
	},
	language: {
		type: String,
		required: true
	}
	
})

module.exports = mongoose.model("challenges", Challenges)