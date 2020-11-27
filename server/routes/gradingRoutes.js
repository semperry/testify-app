const fs = require('fs')
const express = require("express")
const router = express.Router()
const {spawn} = require("child_process")

const Test = require("../models/testModel")
const Challenge = require("../models/challengeModel")

// GET all challenges
router.get("/challenges", (req, res) => {
	Challenge.find((err, results) => {
		if(err){
			res.status(404).json({ message: "Could not get challenges", errors: `${err}`})
		}

		res.status(200).json({ challenges: results })
	})
})

// POST new challenge
router.post("/challenge", (req, res) => {
	const newChallenge = new Challenge(req.body)

	newChallenge
	 .save()
	 .then(data => {
		 res.status(201).json({ message: "Challenge created", challenge: data })
	 })
	 .catch(err => {
		 res.status(400).json({ message: "Could not create", errors: `${err}`})
	 })
})

// GET challenge by id
router.get("/challenge/:id", (req, res) => {
	Challenge.findOne({_id: req.params.id}).populate('test').exec((err, challenge) => {
		if(err){
			res.status(404).json({ message: "Could not get challenge", errors: `${err}`})
		}

		res.status(200).json({ challenge })
	})
})

// PATCH challenge
router.patch("/challenge/:id", (req, res) => {
	Challenge.findOneAndUpdate({ _id: req.params.id}, {test: req.body.test}, (err, doc) => {
		if (err){
			res.status(404).json({ message: "Could not update", errors: `${err}`})
		}

		res.status(200).json({ message: "updated", challenge: doc})
	})
})

// POST new test
router.post("/test", (req, res) => {
	const newTest = new Test(req.body)

	Challenge.findOneAndUpdate({ _id: req.body.challenge }, { test: newTest._id }, (err, doc) => {
		if(err){
			res.status(404).json({ message: "Could not update challenge", errors: `${err}`})
		}
		newTest
		.save()
		.then(data => {
			res.status(201).json({ message: "Test successfully created", test: data})
		})
		.catch(err => {
			res.status(400).json({ message: "Could not create test", errors: `${err}`})
		})
	})
})

// POST submit solution
router.post("/submit-solution", (req, res) => {
	Challenge.findOne({ _id: req.body.challengeId })
	.populate('test')
	.exec((err, challenge) => {
		if(err){
			res.status(404).json({ message: "Could not post solution", errors: `${err}`})
		}
		const language = challenge.language.toLowerCase()
		const ext = language == "python" ? language.slice(0, 2).toLowerCase() : "js"
		const fileName = `test-${req.body.challengeId}-${Date.now()}.${ext}`
		const cmd = language === "python" ? "python" : "node"
		const script = spawn(cmd, [ fileName ])
		const out = []

		fs.writeFileSync(fileName, req.body.content + "\n\n" + challenge.test.content)
		
		script.stderr.on('data', (err) => {
			console.log(err.toString())
			out.push(err.toString())
		})
	
		script.on('close', code => {
			console.log(`Child Process ending with code: ${code}`)
			console.log(out)
			fs.unlinkSync(fileName)
			res.status(200).json({ output: out.join("") })
		})
	})
})


// Deletes
// challenge
router.delete("/challenge/:id", (req, res) => {
	Challenge.findByIdAndDelete(req.params.id, (err) => {
		if(err){
			res.json({ message: "Could not delete", errors: `${err}`})
		}

		res.json({ message: "Deleted"})
	})
})

// test
router.delete("/test/:id", (req, res) => {
	Test.findByIdAndDelete(req.params.id, (err) => {
		if(err){
			res.json({ message: "Could not delete", errors: `${err}`})
		}

		res.json({ message: "Deleted"})
	})
})


module.exports = router