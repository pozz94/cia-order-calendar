import express from "express";
import {query, queryExists} from "dbUtils";
import {getJson} from "fetchUtils";
import {prepareOptions} from "apiUtils";

const router = express.Router();

router.get("/", function(req, res, next) {
	const options = prepareOptions(req.vars, {id: "ID", code: "Code", name: "Name"});
	console.log("PREPARE OPTIONS", options);
	query("SELECT `ID` AS id FROM `models`" + options, [], async items => {
		res.json({
			"@self": {url: req.currentUrl, type: "collection"},
			collection: items.map(item => req.currentUrl.split("?")[0] + "/" + item.id)
		});
	});
});

router.post("/", async (req, res, next) => {
	if (req.body.code && req.body.name) {
		const model = await getJson(req.currentUrl + "/select/bycode/" + req.body.code);
		if (model.error === "not found") {
			query(
				"INSERT INTO `models` (`Code`, `Name`) VALUES (?, ?); SELECT LAST_INSERT_ID() AS `id`;",
				[req.body.code, req.body.name],
				ans => res.status(201).json(getJson(req.currentURL + "/" + ans[ans.length - 1][0].id))
			);
		} else res.status(200).json(model);
	} else res.status(400).json({error: "no model code or name defined"});
});

export default router;
