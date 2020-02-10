import express from "express";
import {idQuery, deleteQuery} from "apiUtils";

const router = express.Router();

router.get(
	"/",
	idQuery(
		"SELECT " +
			"`ID` AS id, " +
			"`DDT` AS `ddt`, " +
			"`Ammount` AS ammount, " +
			"`Item` AS `models`, " +
			"`AltName` AS altName, " +
			"`Color` AS `colors`, " +
			"`DueDate` AS dueDate, " +
			"`Packaging` AS packaging, " +
			"`HighlightColor` AS highlightColor, " +
			"`ItemKey` AS itemKey " +
			"FROM `items` " +
			"WHERE `items`.`ID` = ?"
	)
);

router.delete(
	"/",
	(req, res, next) => {
		console.log(req.vars.id);
		next();
	},
	deleteQuery("DELETE FROM `items` WHERE `ID` = ?", "items")
);

export default router;
