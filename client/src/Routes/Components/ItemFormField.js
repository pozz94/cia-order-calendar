import React, {Component} from "react";
import InputSuggestion from "UI/InputSuggestion";
import c from "./ItemFormField.module.css";
import {BubblePreset} from "UI/CustomColorPicker/CustomColorPicker";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHighlighter, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import Date from "./Components/DateField";

class AddDDT extends Component {
	state = {
		dateFieldType: "text"
	};

	inputRefs = {};

	setValue = whatValue => value => {
		this.props.refreshThisItem({...this.props.value, [whatValue]: value});
	};

	setAltName = value => {
		this.props.refreshThisItem({
			...this.props.value,
			altName: value.altName
		});
	};

	setFocus = toFocus => () => {
		this.inputRefs[toFocus] && this.inputRefs[toFocus].focus();
		this.addNextItemIfComplete();
	};

	setInputRefs = name => ref => (this.inputRefs[name] = ref);

	onEnter = callback => event => {
		if (event.key === "Enter" || event.key === "Tab") {
			event.preventDefault();
			callback(event);
		}
	};

	addNextItemIfComplete = () => {
		if (
			this.props.value.ammount &&
			this.props.value.models.code &&
			this.props.value.models.name &&
			this.props.value.colors.name &&
			this.props.value.dueDate &&
			this.props.isLast
		)
			this.props.addNextItem();
	};

	componentDidMount = () => {
		window.requestAnimationFrame(this.setFocus("ammount"));
	};

	render = () => {
		const {setInputRefs: setRef, setFocus, onEnter, setValue, setAltName} = this;
		const {deleteThisItem, value} = this.props;

		return (
			<div>
				<input
					value={value.ammount || ""}
					onChange={e => this.setValue("ammount")(e.target.value)}
					className={c.number}
					type="number"
					pattern="[0-9]*"
					min="0"
					placeholder="QT"
					ref={setRef("ammount")}
					onKeyPress={onEnter(event => {
						setValue("ammount")(event.target.value);
						setFocus("itemCode")();
					})}
				/>
				<InputSuggestion
					placeholder="Codice Oggetto"
					value={value.models}
					whichProperty={"code"}
					query="models(code=[%value%]){id, name, code}"
					setValue={setValue("models")}
					onSelect={setFocus("color")}
					onEnter={setFocus("itemName")}
					inputRef={setRef("itemCode")}
				/>
				<InputSuggestion
					placeholder="Nome Oggetto"
					value={value.models}
					whichProperty={"name"}
					query="models(name=[%value%]){id, name, code}"
					setValue={setValue("models")}
					onSelect={setFocus("color")}
					onEnter={setFocus("color")}
					inputRef={setRef("itemName")}
				/>
				<InputSuggestion
					placeholder="Descrizione alternativa"
					value={value}
					whichProperty={"altName"}
					query="items(altName=[%value%]){altName}"
					setValue={setAltName}
					onSelect={setFocus("color")}
					onEnter={setFocus("color")}
					inputRef={setRef("itemName")}
				/>
				<InputSuggestion
					placeholder="Colore"
					value={value.colors}
					whichProperty={"name"}
					query="colors(name=[%value%]){id, name}"
					setValue={setValue("colors")}
					onSelect={setFocus("date")}
					onEnter={setFocus("date")}
					inputRef={setRef("color")}
				/>
				<Date
					value={value.dueDate.slice(0, 10)}
					onChange={event => this.setValue("dueDate")(event.target.value)}
					className={c.date}
					placeholder="Consegna"
					type={this.state.dateFieldType || "text"}
					onKeyPress={onEnter(event => {
						setValue("dueDate")(event.target.value);
						setFocus("ammount")();
					})}
					onKeyDown={event => {
						if (event.keyCode === 9) {
							setValue("dueDate")(event.target.value);
						}
					}}
					inputRef={setRef("date")}
				/>
				<input
					defaultChecked={value.packaging || false}
					onChange={event => setValue("packaging")(event.target.checked)}
					className={c.toggle}
					type="checkbox"
					ref={setRef("packaging")}
				/>
				<BubblePreset
					onChange={color =>
						setValue("highlightColor")(parseInt(color.replace("#", "") + "ff", 16))
					}
					defaultColor={
						"#" +
						((value.highlightColor && value.highlightColor.toString(16).slice(0, -2)) || "fff")
					}
					colors={[
						"#fdb790",
						"#fdfa63",
						"#a4f4b5",
						"#92daf2",
						"#f39efa",
						"#dd3636",
						"#eee",
						"white"
					]}
					format="hex"
				>
					<FontAwesomeIcon icon={faHighlighter} style={{fontSize: "1.25rem"}} />
				</BubblePreset>
				<button
					style={{
						fontFamily: "Noto Sans JP, sans-serif",
						fontSize: "1.25rem",
						padding: 0,
						lineHeight: "2.5rem",
						width: "2.5rem",
						margin: "0.5rem",
						verticalAlign: "top"
					}}
					onClick={event => {
						event.preventDefault();
						deleteThisItem();
					}}
				>
					<FontAwesomeIcon icon={faTrashAlt} color="#FFFFFF" style={{fontSize: "1.25rem"}} />
				</button>
			</div>
		);
	};
}

export default AddDDT;
