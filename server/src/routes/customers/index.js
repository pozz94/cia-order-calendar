import express from "express";
import {query, queryExists} from "dbUtils";

const router = express.Router();

router.get("/", (req, res, next) => {
	query("SELECT `ID` AS id, `Name` AS name FROM `customers`", [], rows =>
		res.json(rows)
	);
});

router.post("/", function(req, res, next) {
	if (req.body.name) {
		queryExists(
			"SELECT `ID` AS `id` FROM `customers` WHERE `Name` LIKE ?;",
			[req.body.name],
			//if there are results
			rows => res.json({...rows[0]}),
			//if there aren't
			() => {
				query(
					"INSERT INTO `customers` (`Name`) VALUES (?); SELECT LAST_INSERT_ID() AS `id`;",
					[req.body.name],
					rows => res.json({...rows[rows.length - 1][0]})
				);
			}
		);
	} else res.status(500).json({error: "no customer name defined"});
});

export default router;
