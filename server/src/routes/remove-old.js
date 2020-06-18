import { query } from "dbUtils";
import express from "express";
import {postJson} from "fetchUtils";

const router = express.Router();

const date = new Date();
date.setDate(date.getDate() - 1);

const completionDate = date.toISOString().slice(0, 10);
console.log(completionDate);

router.get("/", (req, res, next) => {
	query(
		`DELETE FROM \`items\` 
			WHERE \`CompletionDate\` <= ? 
			AND \`CompletionDate\` IS NOT NULL
			AND \`Status\` = 'consegnato'`,
		[completionDate],
		async () => {
			postJson(req.rootUrl + "/update", {type: "items"});
			res.json({
				success: true
			});
		}
	);
});

export default router;
