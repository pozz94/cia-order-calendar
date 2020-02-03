import express from "express";
import {query} from "dbUtils";
import {prepareOptions} from "apiUtils";

const router = express.Router();

router.get("/", function(req, res, next) {
	const options = prepareOptions(req.query, {
		id: "ID",
		code: "Code",
		customers: "Customer",
		date: "Date"
	});
	query("SELECT `ID` AS id FROM `ddt`" + options, [], async items => {
		res.json({
			"@self": {url: req.currentUrl, type: "collection"},
			collection: items.map(item => req.currentUrl.split("?")[0] + "/" + item.id)
		});
	});
});

export default router;
