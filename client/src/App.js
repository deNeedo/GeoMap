import React, {useEffect, useState} from "react";
import axios from "axios";
import "./App.css";

function App() {
	const [message, setMessage] = useState("");
	useEffect(() => {
        axios.get("http://localhost:8080/api/bye")
		.then(response => {
			setMessage(response.data);
		})
		.catch(error => {
			console.error("There was an error!", error);
		});
	}, []);
	return (
		<div className="App">
			<h1> {message} </h1>
		</div>
	);
}

export default App;