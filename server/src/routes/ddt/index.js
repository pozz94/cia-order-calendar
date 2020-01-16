import express from "express";
import {putJson, processJsonResponse} from "fetchUtils";
import {query, queryExists} from "dbUtils";

const router = express.Router();

router.put("/", (req, res, next) => {
	if (ddtNumber && date && customerID) {
		queryExists(
			"SELECT `ID` AS `id` FROM `ddt` WHERE `Code` LIKE ? AND `Customer` LIKE ?",
			[ddtNumber, customerID],
			//if there are results
			rows => res.json({...rows[0]}),
			//if there aren't
			() => {
				query(
					"INSERT INTO `ddt` (`Code`, `Customer`, `Date`) VALUES (?, ?, ?); SELECT LAST_INSERT_ID() AS `id`;",
					[ddtNumber, customerID, date],
					rows => res.json({...rows[rows.length - 1][0]})
				);
			}
		);
	} else
		res.status(500).json({error: "no ddt code, date or customer defined"});
});

export default router;
