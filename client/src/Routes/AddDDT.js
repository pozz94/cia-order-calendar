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
			customers: {},
			code: "",
			date: new Date().toISOString().substr(0, 10)
		}
	};

	handleSubmit = async event => {
		//TODO
	};

	fetchDDT = async (ddtData, callback = null) => {
		let query;
		if (ddtData.id) {
			query = `id=${ddtData.id}`;
		} else if (ddtData.code && ddtData.customers.id) {
			query = `code=${ddtData.code}, customers=${ddtData.customers.id}`;
		} else {
			query = `id=0`;
		}
		const list = await postJson("/api/bundler", {
			query: `
				items{
					id,
					ammount,
					dueDate,
					altName,
					itemKey,
					highlightColor,
					colors{id, name},
					models{id, name, code},
					ddt(${query}){
						id,
						code,
						date,
						customers{id, name}
					}					
				}
			`
		});
		if (!list.error && list.collection.length && list.collection[0].ddt) {
			this.setState(
				{
					ddtData: {
						...this.state.ddtData,
						...list.collection[0].ddt,
						date: list.collection[0].ddt.date.slice(0, 10)
					},
					items: list.collection
				},
				() => {
					callback && callback();
				}
			);
		} else {
			this.setState(
				{
					ddtData: {
						...this.state.ddtData,
						"@self": undefined
					},
					items: []
				},
				() => {
					callback && callback();
				}
			);
		}
	};

	addItem = () => {
		const lastItem = (this.state.items.slice(-1)[0] && this.state.items.slice(-1)[0]) || {};

		const items = [
			...this.state.items,
			{
				models: {},
				colors: {},
				dueDate: lastItem.dueDate || "",
				packaging: lastItem.packaging || false,
				highlightColor: lastItem.highlightColor || "#fff",
				ddt: this.state.ddtData,
				itemKey: hash()
			}
		];
		this.setState({items});
	};

	refreshItem = key => value => {
		const items = this.state.items.map(item => {
			if (item.itemKey === key) return {...value, itemKey: key};
			return item;
		});
		this.setState({items});
	};

	deleteItem = key => () => {
		console.log("deleting");
		const Item = this.state.items.filter(item => item.itemKey === key)[0];
		if (Item["@self"] && Item["@self"].url) {
			console.log("deleting from db");
			deleteJson(Item["@self"].url).then(res => {
				console.log("deleted", res);
				this.fetchDDT(this.state.ddtData, this.addItem);
			});
		} else {
			const items = this.state.items.filter(item => item.itemKey !== key);
			this.setState({items});
		}
	};

	setDDT = ddtData => {
		this.setState({ddtData: {...this.state.ddtData, ...ddtData}});
	};

	componentDidMount = () => {
		const {id} = queryString.parse(this.props.location.search);
		if (id) {
			this.fetchDDT({id}, this.addItem);
		}
	};

	render = () => (
		<form className={c.form} onSubmit={this.handleSubmit}>
			<DDTFormField
				ddtData={this.state.ddtData}
				setDDT={this.setDDT}
				addItem={this.addItem}
				fetchDDT={this.fetchDDT}
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
					this.addItem();
				}}
			>
				Aggiungi oggetto
			</button>
			<input type="submit" value="Conferma" />
			<hr />
			<pre>{JSON.stringify(this.state, null, 4)}</pre>
		</form>
	);
}

export default AddDDT;
