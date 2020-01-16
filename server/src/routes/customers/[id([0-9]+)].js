import express from "express"
import {idQuery} from "apiUtils"

const router = express.Router();

router.get('/', idQuery("SELECT `ID` AS id, `Name` AS name FROM `customers` WHERE `ID`=?"));

export default router;
