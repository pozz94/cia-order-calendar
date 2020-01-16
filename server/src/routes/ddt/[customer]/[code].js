import express from "express";
import {query, queryPromise} from "dbUtils";
import {postJson, processJsonResponse} from "fetchUtils";

const router = express.Router();

router.get("/", async (req, res, next) => {
	const rows = await queryPromise(
		"SELECT " +
			"`ddt`.`Date` AS ddtDate, " +
			"`items`.`Ammount` AS ammount, " +
			"`models`.`ID` AS itemID, " +
			"`models`.`Code` AS itemCode, " +
			"`models`.`Name` AS itemName, " +
			"`items`.`AltName` AS itemAltName, " +
			"`colors`.`ID` AS colorID, " +
			"`colors`.`Name` AS colorName, " +
			"`colors`.`Date` AS colorDate, " +
			"`items`.`Packaging` AS packaging, " +
			"`items`.`DueDate` AS dueDate, " +
			"`items`.`HighlightColor` AS highlightColor, " +
			"`items`.`ItemKey` AS itemKey " +
			"FROM `items` " +
			"JOIN `colors` ON `items`.`Color` = `colors`.`ID` " +
			"JOIN `ddt` ON `items`.`DDT` = `ddt`.`ID` " +
			"JOIN `models` ON `items`.`Item` = `models`.`ID` " +
			"JOIN `customers` ON `ddt`.`Customer` = `customers`.`ID` " +
			"WHERE `customers`.`Name` = ?" +
			"AND `ddt`.`Code` = ?" +
			"ORDER BY `items`.`DueDate` DESC, `colors`.`Name` ASC, `models`.`Name` ASC",
		[req.vars.customer, req.vars.code]
	);

	if (rows.length > 0) {
		const items = rows.map(item => {
			return {
				key: item.itemKey,
				value: {
					Ammount: item.ammount,
					Item: {
						id: item.itemID,
						code: item.itemCode,
						name: item.itemName
					},
					Color: {
						id: item.colorID,
						name: item.colorName,
						date: item.colorDate
					},
					Date: item.dueDate.toISOString().slice(0, 10),
					Packaging: item.packaging,
					HighlightColor: "#" + item.highlightColor.toString(16).slice(0, -2)
				}
			};
		});
		res.status(200).json({
			"@self": { url: req.currentURL, type: "obj" },
			customerData: {},
			ddtData: {date: rows[0].ddtDate.toISOString().slice(0, 10)},
			Items: items
		});
	} else {
		console.log("error");
		res.status(404).json({
			error: "Customer or ddtNumber have no match"
		});
	}
});

router.patch("/", async (req, res, next) => {
	const response = await fetch(
		`http://localhost:4000/api/ddt/${req.vars.customer}/${req.vars.code}`
	);
	const ddt = await processJsonResponse(response);

	if (ddt.error) {
		res.status(404).json({
			error: "Customer or ddtNumber have no match"
		});
	} else {
		queryPromise(`UPDATE \`ddt\` SET \`Customer\`=?, \`Code\`=? `, [
			response[0].ddtData.customer
		]).then(async () => {
			const response = await fetch(
				`http://localhost:4000/api/ddt/${req.vars.customer}/${req.vars.code}`
			);
			const ddt = await processJsonResponse(response);

			res.status(200).json(ddt);
		});
	}
});

export default router;
