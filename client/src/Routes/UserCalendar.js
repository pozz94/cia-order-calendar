import React, {useState, useCallback, useEffect, useRef} from "react";
import UserList from "./Components/UserList";
import { postJson } from "Utils/fetchUtils";
import status from "../status.json";

const queryApi = query => postJson("/api/bundler", { query });

const fetchItems = (id = null) => queryApi(`
	items(${id ? `id=${id}, ` : ""} status=${JSON.stringify(status.slice(0, -1))}){
				id,
				ammount,
				dueDate,
				altName,
				highlightColor,
				status,
				oldStatus,
				itemKey,
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
			}`).then(list => list.collection);

const UserCalendar = () => {
	const [list, setList] = useState([]);
	//wierd shit useful because the event handler has a stale state if I don't use a reference
	const listRef = useRef(list);
	const source = useRef(null);

	const fetch = useCallback(() => {
		console.log("fetching");
		fetchItems().then(list => {
			setList(list
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
			);
		});
	}, []);

	const messageHandler = useCallback(
		event => {
			const data = JSON.parse(event.data);
			//if (data.type === "items") fetchList();
			if (data.type === "items") {
				if (data.action === "add") {
					fetchItems(data.id).then(items =>
						setList(l=>[...listRef.current, items[0]])
					);
				} else if (data.action === "edit") {
					fetchItems(data.id).then(items => {
						setList(l=>[...listRef.current.map(element=>element.id===data.id?items[0]:element)])
					})
				} else if (data.action === "delete") {
					setList(l=>listRef.current.filter(element=>element.id!==data.id))
				}
			}
		},
		[]
	);

	useEffect(() => {
		fetch();
	}, [fetch]);

	useEffect(() => {
		console.log("setting event source")
		source.current = new EventSource("api/update");
		source.current.onmessage = messageHandler;
		
		//cleanup
		return () => { console.log("closing event source"); source.current.close() }
	}, [messageHandler]);

	//wierd shit useful because the event handler has a stale state if I don't use a reference
	useEffect(() => {
		listRef.current = list
	}, [list]);

	return <UserList list={list} />;
};

export default UserCalendar;
