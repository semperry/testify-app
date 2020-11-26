import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import axios from "axios"

function Challenge(props){
	const [challenge, setChallenge] = useState({})
	const [attempt, setAttempt] = useState("")
	const [results, setResults] = useState("")

	let {id} = useParams()

	const renderChallenge = () => {
		return (
			<div>
				<p>{challenge.language}</p>
					<p>{challenge.content}</p>

			</div>
		)
	}

	const handleSubmit = e => {
		e.preventDefault()

		axios.post("http://localhost:4000/submit-solution", {
			challengeId: id,
			content: attempt
		})
		.then(res => setResults(String(res.data.output)))
		.catch(err => console.error(err))

	}

	useEffect(() => {
		fetch(`http://localhost:4000/challenge/${id}`)
		.then(res => res.json())
		.then(data => setChallenge(data.challenge))
		.catch(err => console.error("Could not fetch challenge: ", err))
	}, [])

	return (
		<div>
			<h1>Hello from Challenge</h1>
			{renderChallenge()}
			<form onSubmit={handleSubmit}>
				<textarea 
					value={attempt}
					onChange={e => setAttempt(e.target.value)}
				 />
				<button type="submit">Full Send!</button>
			</form>
			<p>{results}</p>
		</div>
	)
}

export default Challenge