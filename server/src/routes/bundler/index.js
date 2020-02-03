import express from "express";
import nearley from "nearley";
import grammar from "./scripts/bundleGrammar";
import generator from "./scripts/bundleGenerator";

const router = express.Router();

router.post("/", async (req, res, next) => {
	let bundleParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	bundleParser.feed(req.body.query.replace(/\s/g, ""));

	res.json(await generator(req.rootUrl, bundleParser.results[0]));
});

export default router;
