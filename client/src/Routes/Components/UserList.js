import React, {useState, useCallback, useEffect, useRef} from "react";
import Item from "./Components/UserItem";
import Header from "./Components/UserTableHeader";
import c from "./UserList.module.css";
import _ from "lodash";
import ShadowContext from "Contexts/shadowContext";

const RenderDays = React.memo((props) => {
	const [done, setDone] = useState(undefined);
	const [isHidden, setHidden] = useState(undefined);

	const cycleHide = useCallback(() => {
		setHidden(isHidden => !isHidden);
	}, []);

	useEffect(() => {
		console.log("props.items changed")
		setDone(d => {
			const done = props.items.filter((data) => data.status !== "completato").length === 0;
			if (done) {
				setHidden(isHidden => {
					if (isHidden === undefined)
						return true;
					return isHidden;
				});
			}
			return done;
		});
		//else setHidden(undefined);
	}, [props.items]);

	return (
		<React.Fragment>
			<Header
				date={props.items[0].dueDate}
				index={props.index}
				occlusionRatios={props.occlusionRatios}
				setOcclusionRatios={props.setOcclusionRatios}
				done={done}
				isHidden={isHidden}
				cycleHide={cycleHide}
			/>
			{
				isHidden
					? null
					: <tbody>
						{props.items.map((data, index) => (
							<Item key={data.itemKey} data={data} />
						))}
					</tbody>
			}
		</React.Fragment>
	)
});

const UserList = props => {
	const groupedItems = _.groupBy(props.list, "dueDate");
	const [finishedGroupedItems, setFinishedGroupedItems] = useState({});
	const [unfinishedGroupedItems, setUnfinishedGroupedItems] = useState({});
	const groupedItemsRef = useRef(groupedItems);

	useEffect(() => {
		console.log("groupedItemsChanged");
		if (JSON.stringify(groupedItems) !== JSON.stringify(groupedItemsRef.current)) {
			groupedItemsRef.current = groupedItems;
			const finished = {}, unfinished = {};
			Object.keys(groupedItems).forEach((day) => {
				const done = groupedItems[day].filter((data) => data.status !== "completato").length === 0;
				if (done) {
					finished[day] = groupedItems[day];
				} else {
					unfinished[day] = groupedItems[day];
				}
			});
			setFinishedGroupedItems(finished);
			setUnfinishedGroupedItems(unfinished);
		}
	}, [groupedItems]);

	return (
		<div className={c.wrapper}>
			<ShadowContext>
				<table>
					{Object.keys(unfinishedGroupedItems).map((day, index) => 
						(<RenderDays
							items={unfinishedGroupedItems[day]}
							key={unfinishedGroupedItems[day][0].itemKey}
							index={index}
						/>))
					}
					{Object.keys(finishedGroupedItems).map((day, index) =>
						(<RenderDays
							items={finishedGroupedItems[day]}
							key={finishedGroupedItems[day][0].itemKey}
							index={index}
						/>))
					}
				</table>
			</ShadowContext>
		</div>
	);
};

export default UserList;
