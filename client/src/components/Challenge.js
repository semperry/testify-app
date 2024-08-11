import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function Challenge(props) {
	const [challenge, setChallenge] = useState({});
	const [attempt, setAttempt] = useState("");
	const [results, setResults] = useState("");

	let { id } = useParams();

	const renderChallenge = () => {
		return (
			<div>
				<p>{challenge.language}</p>
				<p>{challenge.content}</p>
			</div>
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = await axios
			.post("http://localhost:4000/submit-solution", {
				challengeId: id,
				content: attempt,
			})
			.then((res) => res.data)
			.catch((err) => {
				console.error(err);
				return err;
			});

		setResults(data.output || `Failed: ${data}`);
	};

	useEffect(() => {
		fetch(`http://localhost:4000/challenge/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setChallenge(data.challenge);
				setAttempt(data.challenge.starterCode);
			})
			.catch((err) => console.error("Could not fetch challenge: ", err));
	}, [id]);

	if (!challenge.test) {
		return (
			<div>
				<p>No test found for this challenge...</p>
				<Link to="/new-challenge">Add one here</Link>
			</div>
		);
	}
	return (
		<div>
			<h1>{challenge.title || challenge._id}</h1>
			{renderChallenge()}
			<form onSubmit={handleSubmit}>
				<textarea
					value={attempt}
					onChange={(e) => setAttempt(e.target.value)}
				/>
				<button type="submit">Full Send!</button>
			</form>
			<p>{results}</p>
		</div>
	);
}

export default Challenge;
