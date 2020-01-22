import express from "express";
import nearley from "nearley";
import grammar from "./scripts/grammar";
import generator from "./scripts/bundleGenerator";

const router = express.Router();

router.post("/", async (req, res, next) => {
	const bundleParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	bundleParser.feed(`
		[
			href:"${req.rootUrl + req.body.url}",
			nome:"mo",
			range:"0-1"
		]{
			1string, 
			1obj{
				2string
			}, 
			2obj{
				3string
			}
		}
	`);

	//console.log(JSON.stringify(bundleParser.results[0], null, 2));

	console.log(JSON.stringify(generator(req.rootUrl, req.body.query, req.body.url)));

	res.json(await generator(req.rootUrl, req.body.query, req.body.url));
});

export default router;
