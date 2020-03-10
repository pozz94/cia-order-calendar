import React, { useState } from "react";
import { Link } from "react-router-dom";
import status from "../status.json";

let operators = [...status];
operators.pop();
operators.pop();

export default () => {
	const [state, setState] = useState({percentage: 0, weight:0})

	return (
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

			<h2>Calcolo percentuali colore:</h2>

			<div><label for="weight">Peso o volume</label><input id="weight" type="number" value={state.weight} onChange={e => setState({ ...state, weight: e.target.value })} /></div>
			<div><label for="prcntg">Percentuale</label><input id="prcntg" type="number" value={state.percentage} onChange={e => setState({ ...state, percentage: e.target.value })} /></div>
			<div><label for="result">Risultato</label><input id="result" type="number" value={state.weight * state.percentage / 100} /></div>
		</React.Fragment>
	);
};