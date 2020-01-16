import express from "express"
import {selectQuery} from "apiUtils"

const router = express.Router();

router.get('/', selectQuery(
	"SELECT `ID` AS id, `Name` AS name, `Date` AS date FROM `colors` WHERE `Name` = ? ",
	"colors"
    ));

export default router;