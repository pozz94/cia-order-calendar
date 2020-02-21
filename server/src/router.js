import express from "express";

import route0	from "C:/Users/Davide Pozzani/Documents/CCCia/server/src/routes/ddt.js";
import route1	from "C:/Users/Davide Pozzani/Documents/CCCia/server/src/routes/items.js";
import route2	from "C:/Users/Davide Pozzani/Documents/CCCia/server/src/routes/colors.js";
import route3	from "C:/Users/Davide Pozzani/Documents/CCCia/server/src/routes/models.js";
import route4	from "C:/Users/Davide Pozzani/Documents/CCCia/server/src/routes/update.js";
import route5	from "C:/Users/Davide Pozzani/Documents/CCCia/server/src/routes/bundler/index.js";
import route6	from "C:/Users/Davide Pozzani/Documents/CCCia/server/src/routes/customers.js";

const router = express.Router();

const params2vars = (req, res, next) => {
	req.vars = {...req.params};
	next();
};

router.use("/ddt",	params2vars, route0);
router.use("/items",	params2vars, route1);
router.use("/colors",	params2vars, route2);
router.use("/models",	params2vars, route3);
router.use("/update",	params2vars, route4);
router.use("/bundler",	params2vars, route5);
router.use("/customers",	params2vars, route6);

export default router;