import React from "react";
import optimalTextColor from "Utils/optimalTextColor";

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

	return (
		<tr style={{backgroundColor: highlightColor, color: optimalTextColor(highlightColor)}}>
			<td>{props.data.ammount}</td>
			<td>{props.data.models.code}</td>
			<td>{name}</td>
			<td>{props.data.ddt.customers.name}</td>
			<td>{props.data.colors.name}</td>
			<td>{formattedDate}</td>

			<td style={{display: "none"}}>{JSON.stringify(props.data)}</td>
		</tr>
	);
};

export default item;
