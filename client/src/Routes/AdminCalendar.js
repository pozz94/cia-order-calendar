import React, {useState, useCallback, useEffect} from "react";
import AdminList from "./Components/AdminList";
import {postJson} from "Utils/fetchUtils";

const AdminCalendar = () => {
	const [state, setState] = useState({
		list: []
	});

	const fetchList = useCallback(() => {
		postJson("/api/bundler", {
			query: `
			items{
				id,
				ammount,
				dueDate,
				altName,
				highlightColor,
				status,
				oldStatus,
				colors{
					id,
					name
				},
				ddt{
					id,
					code, 
					customers{name}
				},
				models{
					name, 
					code
				}
			}`
		}).then(list => {
			setState({list: list.collection.sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1))});
		});
		console.log("fetching");
	}, []);

	const messageHandler = useCallback(
		event => {
			const data = JSON.parse(event.data);
			if (data === "items") fetchList();
		},
		[fetchList]
	);

	useEffect(() => {
		fetchList();
		let evtSrc = new EventSource("api/update");
		evtSrc.onmessage = messageHandler;
	}, [fetchList, messageHandler]);

	return <AdminList list={state.list} />;
};

export default AdminCalendar;
