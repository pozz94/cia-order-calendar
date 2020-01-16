import express from "express";
import { searchQuery } from "apiUtils"

const router = express.Router();

router.get("/", searchQuery("SELECT `ID` AS id FROM `items` WHERE `ddt` = ?", "items"));

export default router;
