import express from "express";
import {query} from "dbUtils";

const router = express.Router();

router.get("/", function(req, res, next) {
	if (req.vars.id.match(/^\d+$/)) {
		query(
			"SELECT `ID` AS id, `Code` AS code, `Name` AS name FROM `models` WHERE `ID`=?",
			[req.vars.id],
			rows => {
				if (rows.length) res.json({...rows[rows.length - 1], "@self":{url: req.currentUrl, type: "object"}});
				else res.status(404).json({error: "not found"});
			}
		);
	} else {
		res.status(400).json({error: "not a valid id"});
	}
});

export default router;
