import express from "express";
import {getJson} from "fetchUtils";
import nearley from "nearley";
import grammar from "./scripts/grammar.js";

const router = express.Router();

const type = obj =>
	Object.prototype.toString
		.call(obj)
		.split(" ")[1]
		.toLowerCase()
		.slice(0, -1);

router.post("/", async (req, res, next) => {
	const generator = async (query, startingUrl = null, obj = null) => {
		try {
			if (startingUrl) {
				obj = await getJson(req.rootUrl + startingUrl).catch(error =>
					console.log("[bundler] Error while getting", req.rootUrl + startingUrl, ":\n", error)
				);
			}

			if (obj && obj["@self"] && obj["@self"].type && obj["@self"].type === "collection") {
				return {
					...obj,
					collection: await Promise.all(
						obj.collection.map(async item => await generator(query, item.replace(req.rootUrl, "")))
					).catch(error => console.log("[bundler] Error while populating collection:", error))
				};
			}

			const queryType = type(query);

			switch (queryType) {
				case "array":
					return {
						"@self": obj["@self"] || "error @self not defined or object doesn't exist",
						...(await query
							.map(async subQuery => await generator(subQuery, null, obj))
							.reduce(async (a, b) => {
								return {...(await a), ...(await b)};
							}))
					};
				case "object":
					let keyUrl = {};
					Object.keys(obj).map(key => {
						const data = key.match(/^href_([^\W_]+(?:_[^\W_]+)*)\$(\w+)$/);
						if (data && data.length) {
							keyUrl = {
								...keyUrl,
								[data[2]]: "/" + data[1].replace("_", "/") + "/" + obj[key]
							};
						}
					});
					return Object.keys(query)
						.map(async key => {
							return {
								[key]: await generator(query[key], keyUrl[key])
							};
						})
						.reduce(async (a, b) => {
							return {...(await a), ...(await b)};
						});
				case "string":
					return {
						[query]: obj[query] || null,
						...() => (obj[query] ? null : {error: query + " not found"})
					};
				default:
					return {[query]: null};
			}
		} catch (error) {
			console.log("[bundler] Error while populating ", query, ":", error);
		}
	};

	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	parser.feed(`[href:"${req.rootUrl + req.body.url}", nome:"mo", range:"0-1"]{name}`);

	console.log(JSON.stringify(parser.results[0], null, 2));

	res.json(await generator(req.body.query, req.body.url));
});

export default router;
