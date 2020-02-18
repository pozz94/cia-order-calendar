import React from "react";
import c from "./Navbar.module.css";
import modalContext from "Contexts/modalContext";
import {Link} from "react-router-dom";

const navBar = () => (
	<header className={c.header}>
		<div className={c.logoWrapper}>
			<img className={c.logo} src="logo.png" alt="CIA" />
			<h3>CALENDARIO CONSEGNE</h3>
		</div>
		<nav>
			<modalContext.Consumer>
				{context => (
					<React.Fragment>
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
						<Link to="/user-calendar">
							<button>Calendario Operatori</button>
						</Link>
						<Link to="/add-ddt">
							<button>Nuovo ordine</button>
						</Link>
					</React.Fragment>
				)}
			</modalContext.Consumer>
		</nav>
	</header>
);

export default navBar;
