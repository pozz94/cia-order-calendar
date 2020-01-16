import React from "react";

const item = props => {
	const name =
		props.data.altName
			? props.data.altName
			: props.data.model.name;
	const date = new Date(props.data.dueDate);
	//date = new Date("2019-10-25");
	const weekday = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];

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
		<tr>
			<td>{props.data.ammount}</td>
			<td>{props.data.model.code}</td>
			<td>{name}</td>
			<td>{props.data.ddt.customer.name}</td>
			<td>{props.data.ddt.code}</td>
			<td>{props.data.color.name}</td>
			<td>{formattedDate}</td>

			<td style={{display: "none"}}>{JSON.stringify(props.data)}</td>
		</tr>
	);
};

export default item;
