import React, {useState, useCallback, useEffect} from "react";
import Item from "./Components/UserItem";
import Header from "./Components/UserTableHeader";
import c from "./UserList.module.css";
import _ from "lodash";

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
		Object.keys(groupedItems).forEach((day) => {
			const done = groupedItems[day].filter((data) => data.status !== "completato").length === 0;
			if (done && dayIsHidden[day]===undefined) {
				setHidden(day);
			}
		})
	}, [dayIsHidden, groupedItems, setHidden]);

	const [occlusionRatios, setOcclusionRatios] = useState([]);

	return (
		<div className={c.wrapper}>
			<table>
				{Object.keys(groupedItems).map((day, index) => {
					const done = groupedItems[day].filter((data) => data.status !== "completato").length === 0;
					return (
						<React.Fragment key={index}>
							<Header
								date={groupedItems[day][0].dueDate}
								index={index}
								occlusionRatios={occlusionRatios}
								setOcclusionRatios={setOcclusionRatios}
								done={done}
								isHidden={dayIsHidden[day]}
								cycleHide={cycleHide(day)}
							/>
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
					)}
				)}
			</table>
		</div>
	);
};

export default AdminList;
