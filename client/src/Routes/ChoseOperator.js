import React from "react";
import { Link } from "react-router-dom";
import status from "../status.json";

let operators = [...status];
operators.pop();

export default () => (
	<React.Fragment>
		<p>Scegli Operatore:</p>
		{operators.map((element, index) => (
			<Link to={`./user-calendar?status=${index}`} key={index}>
				<button>
					{element}
				</button>
			</Link>
		))}
		<p>
			<Link to="./admin-calendar">
				amministazione
			</Link>
		</p>
	</React.Fragment>
);