import {getJson} from "fetchUtils";

const type = obj =>
	Object.prototype.toString
		.call(obj)
		.toLowerCase()
		.split(" ")[1]
		.slice(0, -1);

const generator = async (apiRoot, query, startingUrl = null, obj = null) => {
	try {
		if (startingUrl) {
			obj = await getJson(apiRoot + startingUrl).catch(error =>
				console.log(
					"[bundler] Error while getting",
					apiRoot + startingUrl,
					"on",
					query,
					":\n",
					error
				)
			);
		}

		if (obj && obj["@self"] && obj["@self"].type && obj["@self"].type === "collection") {
			return {
				...obj,
				collection: await Promise.all(
					obj.collection.map(
						async item => await generator(apiRoot, query, item.replace(apiRoot, ""))
					)
				).catch(error => console.log("[bundler] Error while populating collection:", error))
			};
		}

		const queryType = type(query);

		switch (queryType) {
			case "array":
				return {
					"@self": obj["@self"] || "error @self not defined or object doesn't exist",
					...(await query
						.map(async subQuery => await generator(apiRoot, subQuery, null, obj))
						.reduce(async (a, b) => {
							return {...(await a), ...(await b)};
						}))
				};
			case "object":
				const keyUrl = Object.keys(obj)
					.map(key => {
						const data = key.match(/^href_([^\W_]+(?:_[^\W_]+)*)\$(\w+)$/);
						if (data && data.length) {
							return {[data[2]]: "/" + data[1].replace("_", "/") + "/" + obj[key]};
						}
					})
					.reduce((a, b) => {
						return {...a, ...b};
					});
				return Object.keys(query)
					.map(async key => {
						return {
							[key]: await generator(apiRoot, query[key], keyUrl[key])
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

export default generator;
