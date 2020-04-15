import { query } from "dbUtils";
import express from "express";

const router = express.Router();

const date = new Date();
date.setDate(date.getDate() - 7);

const completionDate = date.toISOString().slice(0, 10);

router.get("/", (req, res, next) => {
	query(
		`DELETE FROM \`items\` 
			WHERE \`CompletionDate\` <= ? 
			AND \`CompletionDate\` IS NOT NULL
			AND \`Status\` = 'consegnato'`,
		[completionDate],
		async () => {
			res.json({
				success: true
			});
		}
	);
});

export default router;
