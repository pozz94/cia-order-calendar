import express from "express";
import { selectQuery } from "apiUtils"

const router = express.Router();

router.delete("/", (req, res, next)=>{console.log(req.vars.query); next();}, selectQuery("DELETE FROM `items` WHERE `itemKey` = ?", "items"));

export default router;