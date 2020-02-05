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
			customers: {},
			code: "",
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

	fetchDDT = async (ddtData, callback = null) => {
		const list = await postJson("/api/bundler", {
			query: `
				items{
					id,
					ammount,
					dueDate,
					altName,
					itemKey,
					highlightColor,
					colors{name},
					ddt(code=${ddtData.code}, customers=${ddtData.customers.id}){
						code,
						date,
						customers{name}
					},
					models{
						name, 
						code
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
					Items: list.collection
				},
				() => {
					callback && callback();
				}
			);
		} else {
			this.setState(
				{
					Items: []
				},
				() => {
					callback && callback();
				}
			);
		}
	};

	addItem = () => {
		let lastItem = (this.state.Items.slice(-1)[0] && this.state.Items.slice(-1)[0].value) || {};
		const Items = [
			...this.state.Items,
			{
				models: {},
				colors: {},
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
			if (item.itemKey === key) return {...value, itemKey: key};
			return item;
		});
		this.setState({Items});
	};

	deleteItem = key => () => {
		const Item = this.state.Items.filter(item => item.itemKey === key)[0];
		if (Item["@self"] && Item["@self"].url) {
			deleteJson(Item["@self"].url).then(() => this.fetchDDT(this.state.ddtData, this.addItem));
		} else {
			const Items = this.state.Items.filter(item => item.itemKey !== key);
			this.setState({Items});
		}
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
				fetchDDT={this.fetchDDT}
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
