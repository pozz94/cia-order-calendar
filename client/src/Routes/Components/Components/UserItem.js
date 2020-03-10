import React from "react";
import optimalTextColor from "Utils/optimalTextColor";
import c from "./UserItem.module.css";
import queryBundler from "Utils/queryBundler";
import queryString from "query-string";
import status from "../../../status.json";
import { useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndoAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

const Item = props => {
	const name = props.data.altName ? props.data.altName : props.data.models.name;

	const highlightColor =
		"#" +
		((props.data.highlightColor && props.data.highlightColor.toString(16).slice(0, -2)) ||
			"ffffff");
	
	const location = useLocation();
	
	const currentOperator = parseInt(queryString.parse(location.search).status);

	const done = currentOperator < status.indexOf(props.data.status);

	const undoStatus = (currentOperator < status.indexOf(props.data.oldStatus))
		? status[currentOperator]
		: props.data.oldStatus || status[currentOperator];

	const style = done
		? { background: "var(--inactive-bg)", color: "gray" }
		: { backgroundColor: highlightColor, color: optimalTextColor(highlightColor) };
	
	const handleCompletion = e => {
		if (!done) {
			queryBundler({
				items: {
					...props.data,
					status: status[currentOperator + 1],
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
		<tr className={[c.userItem, ...done?[c.userItemDone]:[]].join(" ")} style={style}>
			<td>{props.data.ammount}</td>
			<td>
				<p>{name}</p>
				<p className={c.articleCode}>{props.data.models.code}</p>
			</td>
			<td>{props.data.ddt.customers.name}</td>
			<td>{props.data.colors.name}</td>
			{
				currentOperator || currentOperator===0
					? <td className={c.buttonCell}>
						<button onClick={handleCompletion}>
							{!done
								? <FontAwesomeIcon icon={faTimes} />
								: <FontAwesomeIcon icon={faUndoAlt} style={{color: "dimgrey"}}/>
							}
						</button>
					</td>
					: null
			}
		</tr>
	);
};

export default Item;
