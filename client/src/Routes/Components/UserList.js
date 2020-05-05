import React, {useState} from "react";
import Item from "./Components/UserItem";
import Header from "./Components/UserTableHeader";
import c from "./UserList.module.css";
import _ from "lodash";

const AdminList = props => {
	const groupedItems = _.groupBy(props.list, "dueDate");

	const [occlusionRatios, setOcclusionRatios] = useState([]);

	return (
		<div className={c.wrapper}>
			<table>
				{Object.keys(groupedItems).map((day, index) => {
					return (
						<React.Fragment key={index}>
							<Header
								date={groupedItems[day][0].dueDate}
								index={index}
								occlusionRatios={occlusionRatios}
								setOcclusionRatios={setOcclusionRatios}
							/>
							<tbody>
								{groupedItems[day].map((data, index) => (
									<Item key={index} data={data} />
								))}
							</tbody>
						</React.Fragment>
					)}
				)}
			</table>
		</div>
	);
};

export default AdminList;
