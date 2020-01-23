import React, {Component} from "react";
import DDTFormField from "./Components/DDTFormField";
import ItemFormField from "./Components/ItemFormField";
import {putJson, postJson, deleteJson} from "Utils/fetchUtils";
import c from "./AddDDT.module.css";

const hash = () => [...Array(16)].map(i => (~~(Math.random() * 36)).toString(36)).join("");

class AddDDT extends Component {
	state = {
		Items: [],
		ddtData: {
			customer: {},
			ddtNumber: "",
			date: new Date().toISOString().substr(0, 10)
		}
	};

	handleSubmit = async event => {
		event.preventDefault();

		const Items = this.state.Items.filter(
			item =>
				item.value.ammount &&
				item.value.model.code &&
				item.value.model.name &&
				item.value.color.name &&
				item.value.dueDate
		);

		console.log("posting");

		const ddt = await putJson(`/api/ddt`, this.state.ddtData);

		this.setState({...this.state, Items});

		Items.map(async ({value: item}) => {
			item.Color = await postJson("/api/colors", item.Color);
			item.Model = await postJson("/api/models", item.Model);
			item.DDT = ddt;
			putJson("/api/items", item);
		});
	};

	fetchItems = async (customer, code, callback = null) => {
		const list = await postJson("/api/bundler", {
			url: "/items",
			query: [
				"id",
				"ammount",
				"dueDate",
				"asdfg",
				"altName",
				"itemKey",
				"highlightColor",
				{
					color: ["id", "name"],
					ddt: [
						"code",
						"date",
						{
							customer: "name"
						}
					],
					model: ["name", "code"]
				}
			]
		});
		if (!list.error) {
			console.log(list);
			this.setState(
				{
					ddtData: {...this.state.ddtData, date: list.collection[0].ddt.date.slice(0, 10)},
					Items: list.collection
				},
				() => {
					callback && callback();
				}
			);
		} else {
			callback && callback();
		}
	};

	addItem = () => {
		let lastItem = (this.state.Items.slice(-1)[0] && this.state.Items.slice(-1)[0].value) || {};
		const Items = [
			...this.state.Items,
			{
				model: {},
				color: {},
				dueDate: lastItem.date || "",
				packaging: lastItem.packaging || false,
				highlightColor: lastItem.highlightColor || "#fff",
				itemKey: hash()
			}
		];
		this.setState({Items});
	};

	refreshItem = key => value => {
		const Items = this.state.Items.map(item => {
			if (item.itemKey === key) return {...value, key};
			return item;
		});
		this.setState({Items});
	};

	deleteItem = key => () => {
		const Item = this.state.Items.filter(item => item.itemKey === key)[0];
		console.log(Item);
		deleteJson(Item["@self"].url);
		this.fetchItems(this.state.ddtData.customer,this.state.ddtData.ddtNumber)
		//const Items = this.state.Items.filter(item => item.key !== key);
		//this.setState({Items});
	};

	setDDT = ddtData => {
		this.setState({ddtData: {...this.state.ddtData, ...ddtData}});
	};

	render = () => (
		<form className={c.form} onSubmit={this.handleSubmit}>
			<DDTFormField
				ddtData={this.state.ddtData}
				setDDT={this.setDDT}
				addItem={this.addItem}
				fetchItems={this.fetchItems}
			/>
			{this.state.Items.length ? (
				<React.Fragment>
					<hr />
					{this.state.Items.map((item, index) => {
						return (
							<ItemFormField
								key={item.itemKey}
								value={item}
								addNextItem={this.addItem}
								deleteThisItem={this.deleteItem(item.itemKey)}
								refreshThisItem={this.refreshItem(item.itemKey)}
								isLast={this.state.Items.length - 1 === index}
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
