import React, {useState, useRef, useCallback, useEffect} from "react";
import AdminList from "./Components/UserList";
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
			setState({
				list: list.collection
					.sort((a, b) => {
						if (a.dueDate === b.dueDate) {
							if (a.ddt.customers.name === b.ddt.customers.name) {
								if (a.colors.name === b.colors.name) {
									return a.models.code < b.models.code ? -1 : 1;
								}
								return a.colors.name < b.colors.name ? -1 : 1;
							}
							return a.ddt.customers.name < b.ddt.customers.name ? -1 : 1;
						}
						return a.dueDate < b.dueDate ? -1 : 1;
					})
					.filter(item => {
						return item.dueDate >= new Date().toISOString().slice(0, 10);
					})
			});
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

	const evtSrc = useRef(null);
	const listenEvt = useCallback(() => {
		if (!evtSrc.current) {
			evtSrc.current = new EventSource("api/update");
			evtSrc.current.onmessage = messageHandler;
		}
	}, [messageHandler]);

	useEffect(() => {
		fetchList();
		listenEvt();
		return () => evtSrc.current.close();
	}, [fetchList, listenEvt]);

	return <AdminList list={state.list} />;
};

export default AdminCalendar;
