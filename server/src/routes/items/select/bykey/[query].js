import express from "express";
import { searchQuery } from "apiUtils"

const router = express.Router();

router.delete("/", selectQuery("DELETE FROM `items` WHERE `itemKey` = ?", "items"));

export default router;