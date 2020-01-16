import express from "express";
import {idQuery} from "apiUtils"

const router = express.Router();

router.get("/", idQuery (
	"SELECT " +
	"`ID` AS id, " +
	"`DDT` AS `href_ddt$ddt`, " +
	"`Ammount` AS ammount, " +
	"`Item` AS `href_models$model`, " +
	"`AltName` AS altName, " +
	"`Color` AS `href_colors$color`, " +
	"`DueDate` AS dueDate, " +
	"`Packaging` AS packaging, " +
	"`HighlightColor` AS highlightColor " +
	"FROM `items` " +
	"WHERE `items`.`ID` = ?"
));

export default router;
