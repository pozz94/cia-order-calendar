import React from "react";
import optimalTextColor from "Utils/optimalTextColor";
import c from "./UserItem.module.css";
import { postJson } from "Utils/fetchUtils";
import queryString from "query-string";
import status from "../../../status.json";
import {useLocation} from "react-router-dom"

const Item = props => {
	const name = props.data.altName ? props.data.altName : props.data.models.name;

	const highlightColor =
		"#" +
		((props.data.highlightColor && props.data.highlightColor.toString(16).slice(0, -2)) ||
			"ffffff");
	
	const location = useLocation();
	
	const currentOperator = parseInt(queryString.parse(location.search).status);

	const done = currentOperator < status.indexOf(props.data.status);

	const style = done
		? { backgroundColor: "lightgray", color: "gray" }
		: { backgroundColor: highlightColor, color: optimalTextColor(highlightColor) };

	return (
		<tr className={[c.userItem, ...done?[c.userItemDone]:[]].join(" ")} style={style}>
			<td>{props.data.ammount}</td>
			<td>
				<p>{name}</p>
				<p className={c.articleCode}>{props.data.models.code}</p>
			</td>
			<td>{props.data.ddt.customers.name}</td>
			<td>{props.data.colors.name}</td>
			<td className={c.buttonCell}>
				<button
					onClick={e => {
						if (!done) {
							postJson("/api/bundler", {
								query: {
									items: {
										...props.data,
										status: status[currentOperator + 1]
									}
								}
							})
						} else {
							postJson("/api/bundler", {
								query: {
									items: {
										...props.data,
										status: status[currentOperator]
									}
								}
							})
						}
					}}
				>{!done?"✖":"⟲"}</button>
			</td>
		</tr>
	);
};

export default Item;
