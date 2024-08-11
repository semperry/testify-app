const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const express = require("express");

const Challenge = require("../models/challengeModel");

const router = express.Router();
const baseDir = path.join(__dirname, "/../test/");

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
			return res
				.status(404)
				.json({ message: "Could not post solution", errors: `${err}` });
		}

		const language = challenge.language.toLowerCase();
		const ext = language === "python" ? "py" : "js";
		const fileName = `${req.body.challengeId}-${Date.now()}.${ext}`;
		const filePath = path.join(baseDir, fileName);

		const dockerImage =
			language === "python" ? "python:3.9-slim" : "node:18-slim";
		const cmd = language === "python" ? "python3" : "node";

		const jsImports = `const {describe, expect, it, showResults} = require("./ryTest")\n\n`;

		try {
			fs.writeFileSync(
				filePath,
				(language === "javascript" ? jsImports + "\n\n" : "") +
					req.body.content +
					"\n\n" +
					challenge.test.content +
					"\n\n" +
					(language === "javascript" ? "showResults()" : "")
			);
		} catch (err) {
			return res
				.status(500)
				.json({ error: "File creation failed", details: err.message });
		}
		const dockerCommand = `docker run --rm -v ${baseDir}:/server/test:ro -w /server --read-only --memory=128m --cpus=".5" --user=nobody ${dockerImage} ${cmd} test/${fileName}`;

		exec(dockerCommand, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error: ${stderr}`);
				fs.unlink(filePath, (unlinkErr) => {
					if (unlinkErr)
						console.error(`Failed to delete file: ${unlinkErr.message}`);
				});
				return res
					.status(200)
					.json({ error: "Internal server error", output: stderr || stdout });
			}

			fs.unlink(filePath, (unlinkErr) => {
				if (unlinkErr) {
					console.error(`Failed to delete file: ${unlinkErr.message}`);
					return res.status(500).json({
						error: "File deletion failed",
						details: unlinkErr.message,
					});
				}

				res.status(200).json({ output: stdout || stderr });
			});
		});
	});
});

// Deletes Challenge
router.delete("/challenge/:id", (req, res) => {
	Challenge.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			res.json({ message: "Could not delete", errors: `${err}` });
		}

		res.json({ message: "Deleted" });
	});
});

module.exports = router;
