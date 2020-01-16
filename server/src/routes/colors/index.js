import express from "express";
import {query, queryExists} from "dbUtils";

const router = express.Router();

router.get("/", (req, res, next) => {
	query(
		"SELECT `ID` AS id, `Name` AS name, `Date` AS date FROM `colors`",
		[],
		ans => {
			console.log(ans);
			res.json(ans);
		}
	);
});

router.post("/", async (req, res, next) => {
	if (req.body.name) {
		const color = await getJson(req.currentUrl);
		if (color.error==="not found")
		queryExists(
			"SELECT `ID` AS `id` FROM `colors` WHERE `Name` LIKE ?;",
			[req.body.name],
			//if there are results
			ans => res.json({...ans[0]}),
			//if there aren't
			() => {
				query(
					"INSERT INTO `colors` (`Name`, `Date`) VALUES (?, ?); SELECT LAST_INSERT_ID() AS `id`;",
					[req.body.name, new Date().setHours(0, 0, 0, 0).toISOString],
					ans => res.json({...ans[ans.length - 1][0]})
				);
			}
		);
	} else res.status(500).json({error: "no color name defined"});
});

export default router;
