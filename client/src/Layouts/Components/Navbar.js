import React from "react";
import c from "./Navbar.module.css";
import modalContext from "Contexts/modalContext";
import { Link } from "react-router-dom";
import status from "../../status.json";
import queryString from "query-string";
// eslint-disable-next-line
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

const navBar = props => (
	<header className={c.header}>
		<div className={c.logoWrapper}>
			<img className={c.logo} src="logo.png" alt="CIA" />
			<h3>CALENDARIO CONSEGNE</h3>
		</div>
		<nav>
			<modalContext.Consumer>
				{context => (
					<Switch>
						<Route exact path="/"></Route>
						<Route exact path="/user-calendar">
							{
								props => (queryString.parse(props.location.search).status)
									? <Link to="/">
										operatore: {
											status[
												queryString
													.parse(props.location.search)
													.status
											].toUpperCase()
										}
									</Link>
									: null
							}
						</Route>
						<Route exact path="*">
							<Link to="/admin-calendar">Calendario Amministratore</Link>
							<Link to="/">Home</Link>
							<Link to="/add-ddt" className="button">Nuovo ordine</Link>
							<button
								onClick={() =>
									context.displayModal({
										title: "Test",
										message:
											"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." +
											"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
										buttons: [
											{
												action: () => {},
												label: "ok"
											}
										]
									})
								}
							>
								Test
							</button>
						</Route>
					</Switch>
				)}
			</modalContext.Consumer>
		</nav>
	</header>
);

export default navBar;
