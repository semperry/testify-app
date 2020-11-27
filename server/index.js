// TODO:
// Refine models to include title and starter code
// parse for language to determine process to run (js vs py)
// Setup inital jasmine tests and snag output
// Dynamic file naming algorithm to handle multiple writes.
// Dynamic command to run script based on NODE_ENV
// Streamline whole workflow
// Refactor
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 4000

const gradeRoutes = require("./routes/gradingRoutes")

const mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}

mongoose.connect(process.env.MONGODB_URI, mongoOptions,(err) => {
	if (err){
		throw new Error(`MongoDB Error: ${err}`)
	}

	console.log("DB Connected")
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/", gradeRoutes)


app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})