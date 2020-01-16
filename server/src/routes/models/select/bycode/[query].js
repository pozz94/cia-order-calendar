import express from "express"
import {query} from "dbUtils"

const router = express.Router();

router.get('/', function(req, res, next) {
    query(
        "SELECT " +
            "`ID` AS id, " +
            "`Code` AS code, " +
            "`Name` AS name " +
        "FROM `models` " +
        "WHERE `Code` = ? ",
        [req.vars.query],
        (rows)=>{
			if(rows.length)
				res.json(rows[0]);
			else
				res.status(404).json({error: "not found"});
        }
    );
});

export default router;