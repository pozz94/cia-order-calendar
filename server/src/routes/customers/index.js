import express from "express";
import {query, queryExists} from "dbUtils";
import {prepareOptions} from "apiUtils";

const router = express.Router();

router.get("/", function(req, res, next) {
	const options = prepareOptions(req.query, {
		id: "ID",
		name: "Name"
	});
	query("SELECT `ID` AS id FROM `customers`" + options, [], async items => {
		res.json({
			"@self": {url: req.currentUrl, type: "collection"},
			collection: items.map(item => req.currentUrl.split("?")[0] + "/" + item.id)
		});
	});
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
