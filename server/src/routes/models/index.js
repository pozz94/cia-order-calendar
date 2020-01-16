import express from "express";
import { query, queryExists } from "dbUtils";
import { getJson } from "fetchUtils";

const router = express.Router();

router.get("/", (req, res, next) => {
	query(
		"SELECT `ID` AS id, `Code` AS code, `Name` AS name FROM `models`",
		[],
		ans => res.json(ans)
	);
});

router.post("/", async (req, res, next) => {
	if (req.body.code && req.body.name) {
		const model = await getJson(req.currentUrl + "/select/bycode/" + req.body.code);
		if (model.error === "not found" ) {
			query(
					"INSERT INTO `models` (`Code`, `Name`) VALUES (?, ?); SELECT LAST_INSERT_ID() AS `id`;",
					[req.body.code, req.body.name],
					ans => res.status(201).json(getJson(req.currentURL+"/"+ans[ans.length - 1][0].id))
				);
		} else res.status(200).json(model);
	} else res.status(400).json({error: "no model code or name defined"});
});

export default router;
