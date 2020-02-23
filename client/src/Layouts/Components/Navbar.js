import React from "react";
import c from "./Navbar.module.css";
import modalContext from "Contexts/modalContext";
import {Link} from "react-router-dom";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

const navBar = () => (
	<header className={c.header}>
		<div className={c.logoWrapper}>
			<img className={c.logo} src="logo.png" alt="CIA" />
			<h3>CALENDARIO CONSEGNE</h3>
		</div>
		<nav>
			<modalContext.Consumer>
				{context => (
					<Switch>
						<Route exact path="/user-calendar"></Route>
						<Route exact path="*">
							<React.Fragment>
								<Link to="/">Calendario Amministratore</Link>
								<Link to="/user-calendar">Calendario Operatori</Link>
								<Link to="/add-ddt">
									<button>Nuovo ordine</button>
								</Link>
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
							</React.Fragment>
						</Route>
					</Switch>
				)}
			</modalContext.Consumer>
		</nav>
	</header>
);

export default navBar;
