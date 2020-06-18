import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import c from "./AdminItem.module.css";
import queryBundler from "Utils/queryBundler";
import status from "../../../status.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndoAlt, faTimes, faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import { Spinner, Ellipsis } from "UI/Spinner"

const Item = props => {
	const name = props.data.altName ? props.data.altName : props.data.models.name;

	const highlightColor =
		"#" +
		((props.data.highlightColor && props.data.highlightColor.toString(16).slice(0, -2)) ||
			"ffffff");

	const done = status.indexOf("completato") < status.indexOf(props.data.status);
	const [waiting, setWaiting] = useState(false);
	useEffect(() => setWaiting(false), [done]);

	const undoStatus = (status.length - 2 < status.indexOf(props.data.oldStatus))
		? status[status.length - 2]
		: props.data.oldStatus || status[status.length - 2];

	const handleCompletion = e => {
		setWaiting(true);
		const date = new Date();
		if (!done) {
			queryBundler({
				items: {
					...props.data,
					status: status[status.length - 1],
					oldStatus: props.data.status,
					completionDate: date.toISOString().slice(0, 10)
				}
			})
		} else {
			queryBundler({
				items: {
					...props.data,
					status: undoStatus,
					oldStatus: undoStatus,
					completionDate: null
				}
			})
		}
	}

	return (
		<tr>
			<td>{props.data.ammount}</td>
			<td>{props.data.models.code}</td>
			<td>{name}</td>
			<td>{props?.data?.ddt?.customers?.name||"error"}</td>
			<td>
				<Link to={"/add-ddt?id=" + props.data.ddt.id}>{props.data.ddt.code}</Link>
			</td>
			<td>{props.data.colors.name}</td>

			<td style={{display: "none"}}>{JSON.stringify(props.data)}</td>
			<td>
				<div className={c.highlightColor} style={{backgroundColor: highlightColor}} />
			</td>
			<td>{
				!waiting 
					?<React.Fragment>
						{props.data.status === "completato"
							? <span><FontAwesomeIcon icon={faCheck} style={{ color: "var(--main-light)" }} /> </span>
							: null}
						{props.data.status === "consegnato"
							? <span><FontAwesomeIcon icon={faCheckDouble} style={{ color: "var(--active)" }} /> </span>
							: null}
						{props.data.status}
					</React.Fragment>
					:<Ellipsis style={{ fontSize: "1rem" }}/>
			}</td>
			<td className={c.buttonCell}>
				<button onClick={handleCompletion}>
					{
						!waiting ?
							!done
								? <FontAwesomeIcon icon={faTimes} />
								: <FontAwesomeIcon icon={faUndoAlt} />
							:<Spinner style={{ fontSize: "1.5rem"}}/>
					}
				</button>
			</td>
		</tr>
	);
};

export default Item;
