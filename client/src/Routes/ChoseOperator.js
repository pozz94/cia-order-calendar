import React, { useState } from "react";
import { Link } from "react-router-dom";
import status from "../status.json";
import c from "./ChoseOperator.module.css"

let operators = [...status];
operators.pop();
operators.pop();

export default () => {
	const [state, setState] = useState({ percentage: 0, weight: 0 })
	
	const mostAppropriateArticle = number => {
		if (number.toString().startsWith("8") || number === 1 || number === 11){
			return "L'"
		} else if (number<1) {
			return "Lo "
		} else {
			return "Il "
		}
	}

	return (
		<div className={c.wrapper}>
			<div>
				<h1>Scegli Operatore:</h1>
				{operators.map((element, index) => (
					<Link className="button" to={`./user-calendar?status=${index}`} key={index}>{element}</Link>
				))}
			</div>
			<p>
				<Link to="./admin-calendar">
					amministazione
				</Link>
			</p>
			<div>
				<h1>Calcolo percentuali colore:</h1>
				<p>
					<div>
						<label htmlFor="prcntg">Percentuale</label>
						<input id="prcntg" type="number" value={state.percentage} onChange={e => setState({ ...state, percentage: e.target.value })} />
					</div>
					<div>
						<label htmlFor="weight">Peso o volume</label>
						<input id="weight" type="number" value={state.weight} onChange={e => setState({ ...state, weight: e.target.value })} />
					</div>
				</p>
				<h2>{mostAppropriateArticle(state.percentage)}{state.percentage || 0}% di {state.weight || 0} è {state.weight * state.percentage / 100}</h2>
			</div>
		</div>
	);
};