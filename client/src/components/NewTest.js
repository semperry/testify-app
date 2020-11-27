import { useState, useEffect } from 'react';
import axios from "axios"


function NewTest(props){
	const [challenges, setChallenges] = useState([])
	const [testText, setTestText ] = useState("")
	const [chosenId, setChosenId] = useState("")

	const renderChallenges = () => {
		return challenges.map(challenge => {
			if(!challenge.test){
			return (
				<div 
					style={{ cursor: "pointer"}}
					onClick={e => setChosenId(challenge._id)}
				>
					{challenge.title || challenge._id}
				</div>
			)
			}
		})
	}

	const handleSubmit = e => {
		e.preventDefault()

		axios.post("http://localhost:4000/test", {
			content: testText,
			challenge: chosenId
		})
		.then(res => console.log(res.data))
		.catch(err => console.error("Could not post test: ", err))
	}

	useEffect(() => {
		axios.get("http://localhost:4000/challenges")
		.then(res => setChallenges(res.data.challenges))
		.catch(err => console.error("Could not get challenges: ", err))
	}, [])
	
	return (
		<div className="new-test-page">
			{chosenId.length < 1 ? 
				<div>Choose a challenge</div> : 
				<div>
					<form onSubmit={handleSubmit}>
						<textarea 
							value={testText}
							onChange={e => setTestText(e.target.value)}
							placeholder="Write your valid test here"
						/>
						<div>
							<button type="submit">Send It!</button>
						</div>
					</form>

				</div>

			}
			<div>
				{renderChallenges()}
			</div>
		</div>
	)
}

export default NewTest