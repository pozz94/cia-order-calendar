import React, {useEffect} from "react";
import InputSuggestion from "UI/InputSuggestion";
import c from "./DDTFormField.module.css";

let inputRefs = {};

const onEnter = callback => event => {
	if (event.key === "Enter" || event.key === "Tab") {
		event.preventDefault();
		callback(event);
	}
};

const DDTFormField = props => {
	const {customer, ddtNumber, date} = props.ddtData;

	const setFocus = toFocus => () => {
		if (customer && ddtNumber) {
			props.fetchDDT(customer.id, ddtNumber, () => {
				if (customer && ddtNumber && date) {
					props.addItem();
				}
			});
		}
		inputRefs[toFocus] && inputRefs[toFocus].focus();
	};
	const setInputRefs = name => ref => {
		if (ref !== null) inputRefs[name] = ref;
	};

	useEffect(() => {
		window.requestAnimationFrame(setFocus("customer"));
		// eslint-disable-next-line
	}, []);

	return (
		<React.Fragment>
			<InputSuggestion
				placeholder="Cliente"
				value={props.ddtData.customer}
				whichProperty="name"
				fetchSuggestionsFrom="/api/customers/search/byname/"
				setValue={value => {
					props.setDDT({customer: value});
				}}
				onSelect={setFocus("ddtNumber")}
				onEnter={setFocus("ddtNumber")}
				inputRef={setInputRefs("customer")}
			/>
			<input
				value={ddtNumber || ""}
				onChange={event =>
					props.setDDT({
						ddtNumber: event.target.value
					})
				}
				className={c.number}
				type="number"
				pattern="[0-9]*"
				min="0"
				placeholder="DDT"
				ref={setInputRefs("ddtNumber")}
				onKeyPress={onEnter(event => {
					props.setDDT({
						ddtNumber: event.target.value
					});
					setFocus("date")();
				})}
			/>
			<input
				value={date || ""}
				onChange={e => props.setDDT({date: e.target.value})}
				className={c.date}
				type="date"
				placeholder="Data Consegna"
				ref={setInputRefs("date")}
				onKeyPress={onEnter(event => {
					props.setDDT({
						date: event.target.value
					});
					setFocus("number")();
					if (customer && ddtNumber && date) props.addItem();
				})}
				onKeyDown={event => {
					if (event.keyCode === 9) {
						props.setDDT({
							date: event.target.value
						});
					}
				}}
			/>
		</React.Fragment>
	);
};

export default DDTFormField;
