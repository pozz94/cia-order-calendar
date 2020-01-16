import express from "express"
import {idQuery} from "apiUtils"

const router = express.Router();

router.get('/', idQuery("SELECT `ID` AS id, `Name` AS name, `Date` AS date FROM `colors` WHERE `ID`=?"));

export default router;