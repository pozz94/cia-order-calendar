import React from "react";
import { Link } from "react-router-dom";
import status from "../status.json";
import c from "./ChoseOperator.module.css"

let operators = [...status];
operators.pop();
operators.pop();

export default () => {
	return (
		<div className={c.main}>
			<div className={c.wrapper}>
				<div>
					<h1>Scegli Operatore:</h1>
					{operators.map((element, index) => (
						<Link className="button" to={`./user-calendar?status=${index}`} key={index}>{element}</Link>
					))}
				</div>
				<p>
					<Link className="button outline" to="./admin-calendar">
						amministazione
					</Link>
				</p>
			</div>
		</div>
	);
};