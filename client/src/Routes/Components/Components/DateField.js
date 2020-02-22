import React, {useState, useEffect, createRef} from "react";

let input = createRef();
let prevType;

let limiter = false;

const Date = props => {
	const [type, Type] = useState(props.value ? "date" : "text");
	const setType = value => {
		prevType = type;
		Type(value);
	};

	const setTypeDate = () => {
		setType("date");
	};

	const setTypeText = () => {
		//prevType = type;
		if (!input.value && input !== document.activeElement) setType("text");
	};

	useEffect(() => {
		if (prevType === "text" && type === "date" && document.activeElement === input && !limiter) {
			setTimeout(() => {
				window.focus();
				if (document.activeElement) {
					document.activeElement.blur();
				}
				//document.activeElement.blur();
				limiter = true;
				setTimeout(() => {
					input.focus();
					setTimeout(() => {
						limiter = false;
					});
				});
			});
		}
	});

	return (
		<input
			value={props.value}
			onChange={props.onChange}
			className={props.className}
			placeholder={props.placeholder}
			type={type}
			onFocus={() => {
				setTypeDate();

				props.onFocus && props.onFocus();
			}}
			onBlur={() => {
				setTypeText();
				props.onBlur && props.onBlur();
			}}
			onMouseLeave={() => {
				setTypeText();
				props.onMouseLeave && props.onMouseLeave();
			}}
			onMouseEnter={() => {
				setTypeDate();
				props.onMouseEnter && props.onMouseEnter();
			}}
			onKeyPress={props.onKeyPress}
			onKeyDown={props.onKeyDown}
			ref={ref => {
				props.inputRef(ref);
				input = ref;
			}}
		/>
	);
};

export default Date;
