import React from "react";
import optimalTextColor from "Utils/optimalTextColor";

const item = props => {
	const name = props.data.altName ? props.data.altName : props.data.models.name;

	const highlightColor =
		"#" +
		((props.data.highlightColor && props.data.highlightColor.toString(16).slice(0, -2)) ||
			"ffffff");

	return (
		<tr style={{backgroundColor: highlightColor, color: optimalTextColor(highlightColor)}}>
			<td>{props.data.ammount}</td>
			<td>{props.data.models.code}</td>
			<td>{name}</td>
			<td>{props.data.ddt.customers.name}</td>
			<td>{props.data.colors.name}</td>
		</tr>
	);
};

export default item;
