import express from "express";
import nearley from "nearley";
import grammar from "./scripts/bundleGrammar";
import generator from "./scripts/bundleGenerator";

const router = express.Router();

router.post("/", async (req, res, next) => {
	const bundleParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	bundleParser.feed(req.body.query);

	//console.log(JSON.stringify(bundleParser.results[0], null, 2));

	res.json(await generator(req.rootUrl, bundleParser.results[0], req.body.url));
});

export default router;
