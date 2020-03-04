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
	const {customers, code, date} = props.ddtData;

	const setFocus = toFocus => () => {
		if (customers && code && date) {
			props.postDDT();
		}
		inputRefs[toFocus] && inputRefs[toFocus].focus();
	};
	const setInputRefs = name => ref => {
		if (ref !== null) inputRefs[name] = ref;
	};

	const handleSubmit = currentTarget => {
		setTimeout(() => {
			if (!currentTarget.contains(document.activeElement)) {
				if (customers && code && date) {
					props.postDDT();
				}
			}
		}, 0);
	};

	useEffect(() => {
		window.requestAnimationFrame(setFocus("customer"));
		// eslint-disable-next-line
	}, []);

	return (
		<div
			onBlur={e => {
				handleSubmit(e.currentTarget);
			}}
		>
			<InputSuggestion
				placeholder="Cliente"
				value={props.ddtData.customers}
				whichProperty="name"
				query="customers(name=[%value%]){id, name}"
				setValue={value => {
					props.setDDT({customers: value, "@self": undefined, id: undefined});
				}}
				onSelect={setFocus("code")}
				onEnter={setFocus("code")}
				inputRef={setInputRefs("customer")}
			/>
			<input
				value={code || ""}
				onChange={event =>
					props.setDDT({
						"@self": undefined,
						id: undefined,
						code: event.target.value
					})
				}
				className={c.number}
				type="number"
				pattern="[0-9]*"
				min="0"
				placeholder="DDT"
				ref={setInputRefs("code")}
				onKeyPress={onEnter(event => {
					props.setDDT({
						code: event.target.value
					});
					setFocus("date")();
				})}
			/>
			<input
				value={(date && date.slice(0, 10)) || ""}
				onChange={e => {
					props.setDDT({ date: e.target.value })
				}}
				className={c.date}
				type="date"
				placeholder="Data Consegna"
				ref={setInputRefs("date")}
				onKeyPress={onEnter(event => {
					props.setDDT({date: event.target.value,});
					setFocus("number")();
				})}
				onKeyDown={event => {
					if (event.keyCode === 9) {
						props.setDDT({date: event.target.value});
					}
				}}
			/>
		</div>
	);
};

export default DDTFormField;
