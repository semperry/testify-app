import { useState, useEffect } from 'react';
import axios from "axios"


function NewChallenge(props){
	const [content, setContent] = useState("")
	const [language, setLanguage] = useState("python")

	const handleSubmit = e => {
		e.preventDefault()

		axios.post("http://localhost:4000/challenge", {
			content,
			language
		})
		.then(res => setContent(""))
		.catch(err => console.error("Could not submit challenge: ", err))
	}
	
	return (
		<div>
			<h1>Hello from NewChallenge</h1>
			<form onSubmit={handleSubmit}>
				<select 
					value={language} 
					onChange={e => setLanguage(e.target.value)}
				>
					<option value="python">Python</option>
					<option value="javascript">JavaScript</option>
				</select>
				<div>
					<textarea 
						value={content}
						onChange={e => setContent(e.target.value)}
					/>
				</div>
				<button type="submit">SUBMIT</button>
			</form>
		</div>
	)
}

export default NewChallenge