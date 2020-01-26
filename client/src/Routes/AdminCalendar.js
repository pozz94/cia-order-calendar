import React, {useState, useRef, useCallback, useEffect} from "react";
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
				color{
					id,
					name
				},
				ddt{
					code, 
					customer{name}
				},
				model{
					name, 
					code
				}
			}`,
			asdf: [
				"id",
				"ammount",
				"dueDate",
				"asdfg",
				"altName",
				{
					color: ["id", "name"],
					ddt: [
						"code",
						{
							customer: "name"
						}
					],
					model: ["name", "code"]
				}
			]
		}).then(list => {
			console.log(list);
			setState({list: list.collection});
		});
		console.log("fetching");
		//fetch("/api/items").then(res => res.json()).then(list => setState({list: list.collection}));
	}, []);

	const messageHandler = useCallback(
		event => {
			const data = JSON.parse(event.data);
			if (data === "list") fetchList();
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
