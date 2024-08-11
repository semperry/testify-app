// TODO:
// Blocking malicious code?
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const { spawn, spawnSync } = require("child_process");

const Challenge = require("../models/challengeModel");

const baseDir = path.join(__dirname, "/../test/");

const wait = (ms) =>
	new Promise((resolve, reject) => setTimeout(() => resolve, ms));

// GET all challenges
router.get("/challenges", (req, res) => {
	Challenge.find((err, results) => {
		if (err) {
			res
				.status(404)
				.json({ message: "Could not get challenges", errors: `${err}` });
		}

		res.status(200).json({ challenges: results });
	});
});

// POST new challenge
router.post("/challenge", (req, res) => {
	const newChallenge = new Challenge(req.body);

	newChallenge
		.save()
		.then((data) => {
			res.status(201).json({ message: "Challenge created", challenge: data });
		})
		.catch((err) => {
			res.status(400).json({ message: "Could not create", errors: `${err}` });
		});
});

// GET challenge by id
router.get("/challenge/:id", (req, res) => {
	Challenge.findOne({ _id: req.params.id })
		.populate("test")
		.exec((err, challenge) => {
			if (err) {
				res
					.status(404)
					.json({ message: "Could not get challenge", errors: `${err}` });
			}

			res.status(200).json({ challenge });
		});
});

// PUT challenge
router.put("/challenge/:id", (req, res) => {
	Challenge.findById({ _id: req.params.id }, (err, challenge) => {
		if (err) {
			res.status(404).json({ message: "Could not update", errors: `${err}` });
		}

		const { title, starterCode, content, test, language } = req.body;
		challenge.title = title || challenge.title;
		challenge.starterCode = starterCode || challenge.starterCode;
		challenge.content = content || challenge.content;
		challenge.test = test || challenge.test;
		challenge.language = language || challenge.language;

		challenge
			.save()
			.then((data) => {
				res.status(200).json({ message: "updated", challenge: data });
			})
			.catch((err) =>
				res.status(400).json({ message: "Could not update", errors: `${err}` })
			);
	});
});

// POST submit solution
router.post("/submit-solution", (req, res) => {
	Challenge.findOne({ _id: req.body.challengeId }, (err, challenge) => {
		if (err) {
			res
				.status(404)
				.json({ message: "Could not post solution", errors: `${err}` });
		}
		const language = challenge.language.toLowerCase();
		const ext = language == "python" ? "py" : "js";
		const fileName = `${req.body.challengeId}-${Date.now()}.${ext}`;
		const cmd = language === "python" ? "python" : "node";
		const jsImports =
			'const {describe, expect, it, showResults} = require("../libs/ryTest")\n\n';
		const out = [];

		fs.writeFile(
			`${baseDir}${fileName}`,
			(language === "javascript" ? jsImports + "\n\n" : "") +
				req.body.content +
				"\n\n" +
				challenge.test.content +
				"\n\n" +
				(language === "javascript" ? "showResults()" : ""),
			() => {}
		);

		const script = spawn(cmd, [baseDir + fileName], {
			shell: language === "python",
		});

		script.stderr.on("data", (err) => {
			console.log(err.toString());
			out.push(err.toString());
		});

		script.stdout.on("data", (data) => {
			console.log(data.toString());
			out.push(data.toString());
		});

		script.on("close", async (code) => {
			console.log(`Child Process ending with code: ${code}`);
			console.log(out);
			fs.unlinkSync(baseDir + fileName);
			res.status(200).json({ output: out.join("") });
		});
	});
});

// Deletes
// challenge
router.delete("/challenge/:id", (req, res) => {
	Challenge.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			res.json({ message: "Could not delete", errors: `${err}` });
		}

		res.json({ message: "Deleted" });
	});
});

checkKey = (req, res, next) => {
	if (req.body.key === "1234") {
		next();
	} else {
		res.status(401).json({ message: "Needs api key" });
	}
};

// GET Hello App
router.post("/hello", checkKey, (req, res) => {
	const { email, password } = req.body;

	res.send(email);
});

module.exports = router;
