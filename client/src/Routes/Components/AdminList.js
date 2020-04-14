import React from "react";
import Item from "./Components/AdminItem";
import c from "./AdminList.module.css";
import ScrollWrapper from "UI/ScrollWrapper";
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
		<div className={c.main}>
			<ScrollWrapper className={c.wrapper} trackClassName={c.scrollTrack}>
				<div className={c.stickyhead} />
				<table>
					<thead>
						<tr>
							<th>qt</th>
							<th>codice</th>
							<th>descrizione</th>
							<th>cliente</th>
							<th>ddt</th>
							<th>colore</th>
							<th></th>
							<th>stato</th>
						</tr>
					</thead>
					{Object.keys(groupedItems).map((day, index) => (
						<React.Fragment key={index}>
							<thead>
								<tr className={c.groupLabel}>
									<th colSpan="9">In consegna {formatDate(groupedItems[day][0].dueDate)}</th>
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
			</ScrollWrapper>
		</div>
	);
}


export default adminList;
