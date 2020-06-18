import React, { useState, useEffect, useCallback } from "react";
import Item from "./Components/AdminItem";
import c from "./AdminList.module.css";
import ScrollWrapper from "UI/ScrollWrapper";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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

const AdminList = props => {
	const groupedItems = _.groupBy(props.list, "dueDate");
	const [dayIsHidden, setHiddenDay] = useState({});
	const cycleHide = day => () => {
		const handled = { ...dayIsHidden };
		handled[day] = !handled[day];
		setHiddenDay(handled);
	}
	const setHidden = useCallback(day => {
		const handled = { ...dayIsHidden };
		handled[day] = true;
		setHiddenDay(handled);
	}, [dayIsHidden]);

	useEffect(() => {
		Object.keys(groupedItems).map((day) => {
			const done = groupedItems[day].filter((data) => data.status !== "consegnato").length === 0;
			if (done && dayIsHidden[day]===undefined) {
				setHidden(day);
			}
		})
	}, [dayIsHidden, groupedItems, setHidden]);

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
					{Object.keys(groupedItems).map((day, index) => {
						const done = groupedItems[day].filter((data) => data.status !== "consegnato").length === 0;
						return (
							<React.Fragment key={index}>
								<thead>
									<tr className={c.groupLabel}>
										<th colSpan="8">In consegna {formatDate(groupedItems[day][0].dueDate)}</th>
										<th>
											{
												done
													? dayIsHidden[day]
														? <FontAwesomeIcon icon={faChevronDown} onClick={cycleHide(day)} />
														: <FontAwesomeIcon icon={faChevronUp} onClick={cycleHide(day)} />
													: null
											}
										</th>
									</tr>
								</thead>
								{
									dayIsHidden[day]
										? null
										: <tbody>
											{groupedItems[day].map((data, index) => (
												<Item key={index} data={data} />
											))}
										</tbody>
								}
							</React.Fragment>
						)
					}
					)}
				</table>
			</ScrollWrapper>
		</div>
	);
}


export default AdminList;
