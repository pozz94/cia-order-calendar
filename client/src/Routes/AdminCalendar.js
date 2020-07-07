import React, {useState, useCallback, useEffect, useRef} from "react";
import AdminList from "./Components/AdminList";
import { postJson } from "Utils/fetchUtils";

const queryApi = query => postJson("/api/bundler", { query });

const fetchItems = (id = null) => queryApi(`
	items${id ? `(id=${id})` : ""}{
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
	}
`).then(list => list.collection);

const AdminCalendar = () => {
	const [list, setList] = useState([]);
	const source = useRef(null);

	//wierd shit useful because the event handler has a stale state if I don't use a reference
	const listRef = useRef(list);

	const fetch = useCallback((id = null) => {
		console.log("fetching");
		return fetchItems().then(list => {
			setList(list.sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1)));
		});
	}, []);

	const messageHandler = useCallback(
		event => {
			const data = JSON.parse(event.data);
			if (data.type === "items") {
				//console.log(data, list);
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
				//fetch();
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
		listRef.current = list;
	}, [list])



	return <AdminList list={list} />;
};

export default AdminCalendar;
