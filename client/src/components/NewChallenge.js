import { useState } from "react";
import axios from "axios";

function NewChallenge(props) {
	const [content, setContent] = useState("");
	const [title, setTitle] = useState("");
	const [starterCode, setStarterCode] = useState("");
	const [language, setLanguage] = useState("python");
	const [testContent, setTestContent] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		axios
			.post("http://localhost:4000/challenge", {
				content,
				language,
				title,
				starterCode,
				test: {
					content: testContent,
				},
			})
			.then((res) => setContent(""))
			.catch((err) => console.error("Could not submit challenge: ", err));
	};

	return (
		<div>
			<h1>Hello from NewChallenge</h1>
			<form onSubmit={handleSubmit}>
				<select value={language} onChange={(e) => setLanguage(e.target.value)}>
					<option value="python">Python</option>
					<option value="javascript">JavaScript</option>
				</select>
				<div>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Title"
						required
					/>
				</div>
				<div>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Challenge Content"
						required
					/>
				</div>
				<div>
					<textarea
						value={starterCode}
						onChange={(e) => setStarterCode(e.target.value)}
						placeholder="Starter code"
					/>
				</div>
				<div>
					<textarea
						value={testContent}
						onChange={(e) => setTestContent(e.target.value)}
						placeholder="Write a test"
						required
					/>
				</div>
				<button type="submit">SUBMIT</button>
			</form>
		</div>
	);
}

export default NewChallenge;
