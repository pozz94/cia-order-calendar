import React from "react";
import { Link } from "react-router-dom";
import status from "../status.json";

status.pop();

export default () => (
	<React.Fragment>
		<p>Scegli Operatore:</p>
		{status.map((element, index) => (
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