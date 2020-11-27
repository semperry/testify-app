import { useState, useEffect } from 'react';
import { NavLink, useHistory } from "react-router-dom"


function NavBar(props){
	
	return (
		<div>
			<NavLink exact to="/">Home</NavLink>
			<NavLink to="/new-challenge">Create Challenge</NavLink>
			<NavLink to="/new-test">Create Test</NavLink>
		</div>
	)
}

export default NavBar