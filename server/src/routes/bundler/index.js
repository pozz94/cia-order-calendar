import express from "express";
import nearley from "nearley";
import grammar from "./scripts/bundleGrammar";
import getBundle from "./scripts/getBundle";
import type from "typeCheck.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
	if (type(req.body.query) === "string") {
		let bundleParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

		bundleParser.feed(req.body.query);

		res.json(await getBundle(req.rootUrl, bundleParser.results[0]));
	} else if (type(req.body.query) === "object") {
		res.json(await bundle);
	}
});

export default router;
