import React, {Component} from "react";
import DDTFormField from "./Components/DDTFormField";
import ItemFormField from "./Components/ItemFormField";
import { putJson, postJson } from "Utils/fetchUtils"
import c from "./AddDDT.module.css";

const hash = () =>
	[...Array(16)].map(i => (~~(Math.random() * 36)).toString(36)).join("");

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
				item.value.Ammount &&
				item.value.Model.code &&
				item.value.Model.name &&
				item.value.Color.name &&
				item.value.Date
		);

		console.log("posting");

		const ddt = await putJson(`/api/ddt`, this.state.ddtData);

		this.setState({...this.state, Items});

		Items.map(async ({value: item}) => {
			item.Color = await postJson("/api/colors", item.Color);
			item.Model = await postJson("/api/models", item.Model);
			item.DDT = ddt;
			putJson("/api/items", item)
		})
	};

	fetchItems = (customer, code, callback = null) => {
		postJson("/api/bundler", {
			url: "/items",
			query: [
				"id",
				"ammount",
				"dueDate",
				"asdfg",
				"altName",
				{
					"color": [
						"id",
						"name"
					],
					"ddt": [
						"code",
						{
							"customer": "name"
						}
					],
					"model": [
						"name",
						"code"
					]
				}
			]
		})
		fetch(`/api/ddt/${customer}/${code}`)
			.then(res => res.json())
			.then(list => {
				if (!list.error) {
					this.setState(
						{
							ddtData: {...this.state.ddtData, date: list.ddtData.date},
							Items: list.Items
						},
						() => {
							callback && callback();
						}
					);
				} else {
					callback && callback();
				}
			});
	};

	addItem = () => {
		let lastItem =
			(this.state.Items.slice(-1)[0] && this.state.Items.slice(-1)[0].value) ||
			{};
		const Items = [
			...this.state.Items,
			{
				Model: {},
				Color: {},
				Date: lastItem.Date || "",
				Packaging: lastItem.Packaging || false,
				HighlightColor: lastItem.HighlightColor || "#fff",
				key: hash()
			}
		];
		this.setState({Items});
	};

	refreshItem = key => value => {
		const Items = this.state.Items.map(item => {
			if (item.key === key) return {...value, key};
			return item;
		});
		this.setState({Items});
	};

	deleteItem = key => () => {
		const Items = this.state.Items.filter(item => item.key !== key);
		this.setState({Items});
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
					{this.state.Items.map((item, index) => (
						<ItemFormField
							key={item.key}
							value={item}
							addNextItem={this.addItem}
							deleteThisItem={this.deleteItem(item.key)}
							refreshThisItem={this.refreshItem(item.key)}
							isLast={this.state.Items.length - 1 === index}
						/>
					))}
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
