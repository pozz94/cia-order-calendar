import React, {useEffect, useRef, useState} from "react"
import useVisibleRatio from "hooks/useVisibleRatio"
import c from "./UserTableHeader.module.css";

const formatDate = date => {
	date = new Date(date);

	const weekday = ["DOMENICA", "LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ", "SABATO"];

	let formattedDate = "";

	if (!isNaN(date)) {
		formattedDate += weekday[date.getDay()] + " ";
		formattedDate += date.getDate() + "/";
		formattedDate += date.getMonth() + 1 + "/";
		formattedDate += date
			.getYear()
			.toString()
			.substr(-2);
	}

	return formattedDate;
};

const UserTableHeader = props => {
	const [ratio, ref] = useVisibleRatio();
	const { occlusionRatios, setOcclusionRatios, index} = props;
	const [opacity, setOpacity] = useState(0);
	const ratios = useRef([]);
	const nextRatio = ratios.current[index + 1] === undefined ? 1 : ratios.current[index + 1];
	const nextRatioLT1 = nextRatio < 1 ? 0 : 1;

	let isLast = true;
	for (let i = index + 1; i < occlusionRatios.length; i++){
		if (occlusionRatios[i]===0)
		{
			isLast = false;
		}
	}
	
	useEffect(() => {
		const opacityBy4 = (1 - Math.pow(ratio, 2)) * nextRatioLT1;
		setOpacity(Math.round(opacityBy4 / 0.04) / 100);
	}, [ratio, index, nextRatioLT1])
	
	useEffect(() => {
		ratios.current = [...occlusionRatios];
	}, [occlusionRatios])
	useEffect(() => {
		const currentRatios=[...ratios.current]
		currentRatios[index] = ratio;
		setOcclusionRatios(currentRatios);
	}, [ratio, opacity, index, setOcclusionRatios]);
	
	return (
		<thead ref={ref} className={c.header}>
			<tr className={c.groupLabel}>
				<th colSpan="5">
					In consegna {
						formatDate(props.date)
					}
				</th>
			</tr>
			<tr className={c.labelsWrapper}>
				<th>qt</th>
				<th>articolo</th>
				<th>cliente</th>
				<th colSpan="2">colore</th>
			</tr>
			<tr className={c.shadow}>
				<th colSpan="5" >
					<div style={{
						boxShadow: `0 0.5rem 0.25rem -0.325rem rgba(0,0,0,${isLast ? opacity : 0}`
					}} />
				</th>
			</tr>
		</thead>
	)
}

export default UserTableHeader;
					

