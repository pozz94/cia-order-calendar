import React from "react";
import optimalTextColor from "Utils/optimalTextColor";
import c from "./UserItem.module.css";

const item = props => {
	const name = props.data.altName ? props.data.altName : props.data.models.name;

	const highlightColor =
		"#" +
		((props.data.highlightColor && props.data.highlightColor.toString(16).slice(0, -2)) ||
			"ffffff");

	return (
		<tr className={c.userItem} style={{backgroundColor: highlightColor, color: optimalTextColor(highlightColor)}}>
			<td>{props.data.ammount}</td>
			<td>
				<p>{name}</p>
				<p className={c.articleCode}>{props.data.models.code}</p>
			</td>
			<td>{props.data.ddt.customers.name}</td>
			<td>{props.data.colors.name}</td>
			<td className={c.buttonCell}><button>×</button></td>
		</tr>
	);
};

export default item;
