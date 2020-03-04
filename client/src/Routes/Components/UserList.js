import React from "react";
import Item from "./Components/UserItem";
import c from "./UserList.module.css";
import _ from "lodash";

const formatDate = date => {
	date = new Date(date);
	//date = new Date("2019-10-25");
	const weekday = ["DOMENICA", "LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ", "SABATO"];

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

	return formattedDate;
};

const adminList = props => {
	const groupedItems = _.groupBy(props.list, "dueDate");

	return (
		<div className={c.wrapper}>
			<table>
				{Object.keys(groupedItems).map((day, index) => (
					<React.Fragment key={index}>
						<thead>
							<tr className={c.groupLabel}>
								<th colSpan="5">In consegna {formatDate(groupedItems[day][0].dueDate)}</th>
							</tr>
							<tr className={c.labelsWrapper}>
								<th>qt</th>
								<th>articolo</th>
								<th>cliente</th>
								<th>colore</th>
							</tr>
						</thead>
						<tbody>
							{groupedItems[day].map((data, index) => (
								<Item key={index} data={data} />
							))}
						</tbody>
					</React.Fragment>
				))}
			</table>
		</div>
	);
};

export default adminList;
