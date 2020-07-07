import React, {useState, useEffect, useRef, useCallback} from "react";
import DDTFormField from "./Components/DDTFormField";
import ItemFormField from "./Components/ItemFormField";
import {postJson, deleteJson} from "Utils/fetchUtils";
import c from "./AddDDT.module.css";
import queryString from "query-string";
import {useHistory, useLocation} from "react-router-dom"

const hash = () => [...Array(16)].map(i => (~~(Math.random() * 36)).toString(36)).join("");

const queryApi = query =>
	postJson("/api/bundler", { query });

const fetchItems = (id = null, ddt = null) => queryApi(`
	items${id ? `(id=${id})` : ""}{
		id,
		ammount,
		dueDate,
		altName,
		itemKey,
		highlightColor,
		packaging,
		colors{id, name},
		models{id, name, code},
		ddt${ddt ? `(id=${ddt})` : ""}{
			id,
			code,
			date,
			customers{id, name}
		}					
	}
`).then(list => list.collection);

const AddDDT = (props) => {
	const [items, setItems] = useState([]);
	const [ddtData, setDdtData] = useState({
		customers: null,
		code: null,
		date: new Date().toISOString().substr(0, 10)
	});
	const listRef = useRef(items);

	const source = useRef();

	const history = useHistory();
	const location = useLocation();

	const { id } = queryString.parse(location.search);

	const messageHandler = useCallback(
		event => {
			const data = JSON.parse(event.data);

			if (data.type === "items") {
				if (data.action === "add") {
					fetchItems(data.id).then(list => {
						setItems(i => {
							let updated = false;
							let newList = i.map(element => {
								if (element.itemKey === list[0].itemKey) {
									console.log("updating")
									updated = true;
									return list[0];
								}
								return element;
							});
							if (!updated) {
								newList = [...i, list[0]];
							}
							return newList;
						});
					});
				} else if (data.action === "edit") {
					fetchItems(data.id).then(list => {
						setItems(i=>[...i.map(element=>element.id===data.id?list[0]:element)])
					})
				} else if (data.action === "delete") {
					setItems(i=>i.filter(element=>element.id!==data.id))
				}
			}
		},
		[]
	);

	const addItem = useCallback(() => {
		let lastItem = listRef.current[listRef.current.length - 1];
		if (!lastItem || lastItem.models || lastItem.colors) {
			if (ddtData["@self"]) {
				lastItem = lastItem || {}
				setItems(i => [
					...i,
					{
						models: null,
						colors: null,
						dueDate: lastItem.dueDate || "",
						packaging: lastItem.packaging || false,
						highlightColor: lastItem.highlightColor || 4294967295,
						ddt: ddtData,
						itemKey: hash()
					}
				]);
			}
		}
	}, [ddtData]);

	const fetch = useCallback(async () => {
		console.log("fetching");

		if (id) {
			const list = await fetchItems(null, id);

			console.log(list);

			if (list && list.length && list[0].ddt) {
				setDdtData(list[0].ddt);

				if (list[0].ddt === listRef?.current[0]?.ddt || !listRef?.current[0]?.ddt){
					console.log("adding new items and changing ddt");
					setItems(i=>[
						...i.map(item => {
							item.ddt = list[0].ddt
							return item;
						}),
						...list
					]);
				}
				else {
					console.log("replacing items");
					setItems([...list]);
				}
			} else {
				const ddt = await queryApi(`
					ddt(id=${id}){
						id,
						code,
						date,
						customers{id, name}
					}
				`).then(list => list.collection);

				if (ddt && ddt[0]) {
					console.log("setting ddt tu current items");
					setDdtData(d=>ddt[0]);
					setItems(i=>i.map(item => {
						item.ddt = ddt[0];
						return item;
					}));
				} else {
					history.push(`/404`);
				}
			}
		} else {
			setDdtData({
				customers: null,
				code: null,
				date: new Date().toISOString().substr(0, 10)
			});
			setItems([]);
		}	
	}, [id, history]);

	useEffect(() => { fetch() }, [fetch]);

	useEffect(() => {
		console.log("setting event source")
		source.current = new EventSource("api/update");
		source.current.onmessage = messageHandler;
		
		//cleanup
		return () => { console.log("closing event source"); source.current.close() }
	}, [messageHandler]);

	//wierd shit useful because the event handler has a stale state if I don't use a reference
	useEffect(() => {
		listRef.current = items;
	}, [items]);

	useEffect(() => { addItem() }, [addItem, ddtData])

	const handleSubmit = () => {
		//TODO
	}

	const postDDT = () => {
		queryApi({ ddt: ddtData }).then((res) => {
			history.push(`/add-ddt?id=${res.ddt}`);
		});
	}

	const refreshItem = key => value => {
		setItems(items.map(item => {
			if (item.itemKey === key) return {...item, ...value};
			return item;
		}));
	};

	const deleteItem = key => () => {
		const item = items.filter(item => item.itemKey === key)[0];
		//const items = items.filter(item => item.itemKey !== key);
		//this.setState({items}, () => {
		if (item["@self"]?.url) {
			console.log("deleting from db");
			deleteJson(item["@self"].url).then(res => {
				console.log("deleted", res);
			});
		}
	};

	const setDDT = ddt => {
		setDdtData({...ddtData, ...ddt});
	};

	return(
		<form className={c.form} onSubmit={handleSubmit}>
			<DDTFormField
				ddtData={ddtData}
				setDDT={setDDT}
				addItem={addItem}
				postDDT={postDDT}
			/>
			{items.length ? (
				<React.Fragment>
					<hr />
					{items.map((item, index) => {
						return (
							<ItemFormField
								key={item.itemKey}
								value={item}
								addNextItem={addItem}
								deleteThisItem={deleteItem(item.itemKey)}
								refreshThisItem={refreshItem(item.itemKey)}
								isLast={items.length - 1 === index}
							/>
						);
					})}
					<hr />
				</React.Fragment>
			) : (
				<hr />
			)}
			<button
				onClick={e => {
					e.preventDefault();
					addItem();
				}}
			>
				Aggiungi oggetto
			</button>
			<button className="outline">Conferma</button>
		</form>
	);
}

export default AddDDT;
