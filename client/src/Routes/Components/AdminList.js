import React from "react";
import Item from "./Components/AdminItem";
import c from "./AdminList.module.css";
import ScrollWrapper from "UI/ScrollWrapper";

const adminList = props => (
	<ScrollWrapper className={c.wrapper} trackClassName={c.scrollTrack}>
		<div className={c.stickyhead} />
		<table>
			<thead>
				<tr>
					<th>qt</th>
					<th>codice</th>
					<th>descrizione</th>
					<th>cliente</th>
					<th>ddt</th>
					<th>colore</th>
					<th>consegna</th>
					<th></th>
					<th>stato</th>
				</tr>
			</thead>
			<tbody>
				{props.list.map((data, index) => (
					<Item key={index} data={data} />
				))}
			</tbody>
		</table>
	</ScrollWrapper>
);

export default adminList;
