import express from "express";
import {idQuery} from "apiUtils";

const router = express.Router();

router.get(
	"/",
	idQuery(
		"SELECT `ID` AS id, `Code` AS code, `Customer` AS `customers`, `Date` AS date FROM `ddt` WHERE `ID`=?"
	)
);

export default router;
