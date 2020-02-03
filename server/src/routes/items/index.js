import express from "express";
import {query} from "dbUtils";
import {prepareOptions} from "apiUtils";

const router = express.Router();

router.get("/", function(req, res, next) {
	const options = prepareOptions(req.query, {
		id: "ID",
		ddt: "DDT",
		ammount: "Ammount",
		models: "Item",
		altName: "AltName",
		colors: "Color",
		dueDate: "DueDate",
		packaging: "Packaging",
		highlightColor: "HighlightColor",
		itemKey: "ItemKey"
	});
	query("SELECT `ID` AS id FROM `items`" + options, [], async items => {
		res.json({
			"@self": {url: req.currentUrl, type: "collection"},
			collection: items.map(item => req.currentUrl.split("?")[0] + "/" + item.id)
		});
	});
});

/*
code to update listeners

postJson(`http://localhost:4000/api/update`, {
	type: "list"
}).catch(error => {
	console.log("[list api error]", error);
});*/

export default router;
