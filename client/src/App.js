import {useState, useEffect } from "react"
import {Link} from "react-router-dom"

function App() {
	const [challenges, setChallenges] = useState([])

	const renderChallanges = () => {
		return challenges.map(challenge => {
			const {_id} = challenge
			return (
				<div key={_id}>
					<Link to={`/challenge/${_id}`}>{_id}</Link>
				</div>
			)
		})
	}

	useEffect(() => {
		fetch("http://localhost:4000/challenges")
		.then(res => res.json())
		.then(data => setChallenges(data.challenges))
		.catch(err =>  console.error("Could not get challanges: ", err))
	},[])

  return (
    <div className="App">
			<h1>Hello from App</h1>
			{renderChallanges()}
    </div>
  );
}

export default App;
