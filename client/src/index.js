import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from "react-router-dom"

import './styles/main.scss';
import App from './App';
import Challenge from "./components/Challenge"
import NewChallenge from './components/NewChallenge';
import NavBar from './components/navigation/navBar';
import NewTest from './components/NewTest';

ReactDOM.render(
	<BrowserRouter>
	<NavBar />
	<Switch>
		<Route path="/" exact component={App} />
		<Route path="/new-challenge" component={NewChallenge} />
		<Route path="/new-test" component={NewTest} />
		<Route path="/challenge/:id" component={Challenge} />
	</Switch>
	</BrowserRouter>,
  document.getElementById('root')
);

