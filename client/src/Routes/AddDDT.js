import React, {Component} from "react";
import DDTFormField from "./Components/DDTFormField";
import ItemFormField from "./Components/ItemFormField";
import {postJson, deleteJson} from "Utils/fetchUtils";
import c from "./AddDDT.module.css";
import queryString from "query-string";

const hash = () => [...Array(16)].map(i => (~~(Math.random() * 36)).toString(36)).join("");

class AddDDT extends Component {
	state = {
		items: [],
		ddtData: {
			customers: null,
			code: null,
			date: new Date().toISOString().substr(0, 10)
		}
	};

	handleSubmit = async event => {
		//TODO
	};

	fetchDDT = async (callback = () => {}) => {
		const { id } = queryString.parse(this.props.location.search);

		if (id) {
			const list = await postJson("/api/bundler", {
				query: `
					items{
						id,
						ammount,
						dueDate,
						altName,
						itemKey,
						highlightColor,
						packaging,
						colors{id, name},
						models{id, name, code},
						ddt(id=${id}){
							id,
							code,
							date,
							customers{id, name}
						}					
					}
				`
			});
			if (!list.error && list.collection.length && list.collection[0].ddt) {
				console.log("list not empty, updating ddt", id, list.collection[0].ddt);

				const ddtData = list.collection[0].ddt;

				let items = this.state.items
					.map(item => {
						const index = list.collection.findIndex(obj => obj.itemKey === item.itemKey);
						item = item["@self"] ? null : item;
						item = list.collection[index] || item;
						if (index >= 0) list.collection.splice(index, 1);
						return item;
					})
					.filter(item => item !== null)
					.map(item => {
						item.ddt = ddtData;
						return item;
					});

				items = [...items, ...list.collection];

				this.setState(
					{
						ddtData,
						items
					},
					callback
				);
			} else {
				console.log("error or empty list");

				const ddtData = await postJson("/api/bundler", {
					query: `
						ddt(id=${id}){
							id,
							code,
							date,
							customers{id, name}
						}
					`
				});

				if (!ddtData.error && ddtData.collection[0]) {
					this.setState(
						{
							ddtData: ddtData.collection[0],
							items: this.state.items.map(item => {
								item.ddt = ddtData.collection[0];
								return item;
							})
						},
						() => {
							if (!this.state.items.length) {
								this.addItem();
							}
							callback();
						}
					);
				} else {
					this.props.history.push(`/404`);
				}
			}
		} else {
			console.log("resetting")
			this.setState(
				{
					ddtData: {
						customers: null,
						code: null,
						date: new Date().toISOString().substr(0, 10)
					},
					items: []
				},
				() => {
					if (!this.state.items.length) {
						this.addItem();
					}
					callback();
				}
			);
		}	
	};

	postDDT = () => {

		console.log("posting altered DDT data:", { ddt: this.state.ddtData })
		postJson("/api/bundler", { query: { ddt: this.state.ddtData } }).then((res) => {
			this.props.history.push(`/add-ddt?id=${res.ddt}`);
		});
	}

	addItem = () => {
		const lastItem = (this.state.items.slice(-1)[0] && this.state.items.slice(-1)[0]) || {};

		const items = [
			...this.state.items,
			{
				models: {},
				colors: {},
				dueDate: lastItem.dueDate || "",
				packaging: lastItem.packaging || false,
				highlightColor: lastItem.highlightColor || 4294967295,
				ddt: this.state.ddtData,
				itemKey: hash()
			}
		];
		this.setState({items});
	};

	refreshItem = key => value => {
		const items = this.state.items.map(item => {
			if (item.itemKey === key) return {...item, ...value};
			return item;
		});
		this.setState({items});
	};

	deleteItem = key => () => {
		const Item = this.state.items.filter(item => item.itemKey === key)[0];
		const items = this.state.items.filter(item => item.itemKey !== key);
		this.setState({items}, () => {
			if (Item["@self"] && Item["@self"].url) {
				console.log("deleting from db");
				deleteJson(Item["@self"].url).then(res => {
					console.log("deleted", res);
				});
			}
		});
	};

	source = new EventSource("api/update");

	messageHandler = event => {
		const data = JSON.parse(event.data);
		if (data === "items") this.fetchDDT();
	};

	setDDT = ddtData => {
		this.setState({ddtData: {...this.state.ddtData, ...ddtData}});
	};

	componentDidMount = () => {
		this.source.onmessage = this.messageHandler;
		const {id} = queryString.parse(this.props.location.search);
		if (id) {
			this.fetchDDT();
		}
	};

	componentDidUpdate = (prevProps) => {
		const {id:oldId} = queryString.parse(prevProps.location.search);
		const { id } = queryString.parse(this.props.location.search);

		console.log((id || oldId) && oldId!==id)

		if((id || oldId) && oldId!==id){
			this.fetchDDT();
		}
	}

	render = () => (
		<form className={c.form} onSubmit={this.handleSubmit}>
			<DDTFormField
				ddtData={this.state.ddtData}
				setDDT={this.setDDT}
				addItem={this.addItem}
				postDDT={this.postDDT}
			/>
			{this.state.items.length ? (
				<React.Fragment>
					<hr />
					{this.state.items.map((item, index) => {
						return (
							<ItemFormField
								key={item.itemKey}
								value={item}
								addNextItem={this.addItem}
								deleteThisItem={this.deleteItem(item.itemKey)}
								refreshThisItem={this.refreshItem(item.itemKey)}
								isLast={this.state.items.length - 1 === index}
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
					this.fetchDDT(this.addItem());
				}}
			>
				Aggiungi oggetto
			</button>
			<input type="submit" value="Conferma" />
		</form>
	);
}

export default AddDDT;
