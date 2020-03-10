import React from "react";
import {Link} from "react-router-dom";
import c from "./AdminItem.module.css";
import queryBundler from "Utils/queryBundler";
import status from "../../../status.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndoAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

const item = props => {
	const name = props.data.altName ? props.data.altName : props.data.models.name;
	const date = new Date(props.data.dueDate);
	//date = new Date("2019-10-25");
	const weekday = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];

	const highlightColor =
		"#" +
		((props.data.highlightColor && props.data.highlightColor.toString(16).slice(0, -2)) ||
			"ffffff");

	let formattedDate = "";

	if (!isNaN(date)) {
		formattedDate += weekday[date.getDay()] + " ";
		formattedDate += date.getDate() + "/";
		formattedDate += date.getMonth() + 1 + "/";
		formattedDate += date
			.getYear()
			.toString()
			.substr(-2);
	}

	const done = status.indexOf("completato") < status.indexOf(props.data.status);

	const undoStatus = (status.length - 2 < status.indexOf(props.data.oldStatus))
		? status[status.length - 2]
		: props.data.oldStatus;

	const handleCompletion = e => {
		if (!done) {
			queryBundler({
				items: {
					...props.data,
					status: status[status.length - 1],
					oldStatus: props.data.status,
				}
			})
		} else {
			queryBundler({
				items: {
					...props.data,
					status: undoStatus,
					oldStatus: undoStatus
				}
			})
		}
	}

	return (
		<tr>
			<td>{props.data.ammount}</td>
			<td>{props.data.models.code}</td>
			<td>{name}</td>
			<td>{props.data.ddt.customers.name}</td>
			<td>
				<Link to={"/add-ddt?id=" + props.data.ddt.id}>{props.data.ddt.code}</Link>
			</td>
			<td>{props.data.colors.name}</td>
			<td>{formattedDate}</td>

			<td style={{display: "none"}}>{JSON.stringify(props.data)}</td>
			<td>
				<div className={c.highlightColor} style={{backgroundColor: highlightColor}} />
			</td>
			<td>
				{props.data.status}
			</td>
			<td className={c.buttonCell}>
				<button onClick={handleCompletion}>
					{!done
						? <FontAwesomeIcon icon={faTimes} />
						: <FontAwesomeIcon icon={faUndoAlt} />
					}
				</button>
			</td>
		</tr>
	);
};

export default item;
