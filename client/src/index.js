import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from "react-router-dom"

import './index.css';
import App from './App';
import Challenge from "./components/Challenge"

ReactDOM.render(
	<BrowserRouter>
	<Switch>
		<Route path="/" exact component={App} />
		<Route path="/challenge/:id" component={Challenge} />
	</Switch>
	</BrowserRouter>,
  document.getElementById('root')
);

