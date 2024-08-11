import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from "react-router-dom"

import './styles/main.scss';
import App from './App';
import Challenge from "./components/Challenge"
import NewChallenge from './components/NewChallenge';
import NavBar from './components/navigation/navBar';

ReactDOM.render(
	<BrowserRouter>
	<NavBar />
	<Switch>
		<Route path="/" exact component={App} />
		<Route path="/new-challenge" linkText="Create" component={NewChallenge} />
		<Route path="/challenge/:id" component={Challenge} />
	</Switch>
	</BrowserRouter>,
  document.getElementById('root')
);

