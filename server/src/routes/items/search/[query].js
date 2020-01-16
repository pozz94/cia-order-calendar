import express from "express"
import DB from "DB"

const router = express.Router();

router.get('/', function(req, res, next) {
    const query = "%" + req.vars.query + "%";
    DB.getCon().query(
        "SELECT " +
            "`ID` AS id, " +
            "`Code` AS code, " +
            "`Name` AS name " +
        "FROM `items` " +
        "WHERE `Code` LIKE ? " +
            "OR `Name` LIKE ? ",
        [query, query],
        (err, rows, fields)=>{
            if(err) {
                res.status(500).json({error: "mysql error"});
                console.log("[mysql error]", err);
            }
            else {
                if(rows.length!==0)
                    res.json(rows.sort((a, b)=>{
                        const evaluate = (value)=>{
                            let valueCodeDist = value.code.toLowerCase().indexOf(req.vars.query.toLowerCase());
                            valueCodeDist = (valueCodeDist===-1)?1000000000:valueCodeDist;
                            valueCodeDist += (value.code.length) * 0.001;

                            let valueNameDist = value.name.toLowerCase().indexOf(req.vars.query.toLowerCase());
                            valueNameDist = (valueNameDist===-1)?1000000000:valueNameDist;
                            valueNameDist += (value.name.length) * 0.001;

                            let valueDist = (valueCodeDist<=valueNameDist)?valueCodeDist:valueNameDist;

                            return valueDist;
                        }
                        return evaluate(a)-evaluate(b);
                    }));
                else
                    res.status(404).json({error: "not found"});
            }
        }
    );
    DB.end();
});

export default router;