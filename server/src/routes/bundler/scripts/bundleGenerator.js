import {getJson} from "fetchUtils";
import nearley from "nearley";
import grammar from "./relationshipGrammar";

const type = obj =>
	Object.prototype.toString
		.call(obj)
		.toLowerCase()
		.split(" ")[1]
		.slice(0, -1);

const generator = async (apiRoot, query) => {
	try {
		const href = apiRoot + "/" + query.href + (query.id ? "/" + query.id : "");

		//console.log(query);

		let obj = await getJson(href).catch(error =>
			console.log("[bundler] Error while getting", href, "on", query, ":\n", error)
		);

		if (obj["@self"] && obj["@self"].type && obj["@self"].type === "collection") {
			return {
				...obj,
				collection: await Promise.all(
					obj.collection.map(item =>
						generator(apiRoot, {...query, href: item.replace(apiRoot, "")})
					)
				).catch(error => console.log("[bundler] Error while populating collection:", error))
			};
		} else {
			const response = await Promise.all(
				query.data.map(async element => {
					if (type(element) === "string") {
						return {
							[element]: obj[element] || null,
							...() => (obj[element] ? null : {error: element + " not found"})
						};
					} else if (type(element) === "object") {
						if (!obj.relationships) {
							obj.relationships = Object.keys(obj)
								.map(el => {
									const relationshipParser = new nearley.Parser(
										nearley.Grammar.fromCompiled(grammar)
									);
									relationshipParser.feed(el);
									if (relationshipParser.results[0]) {
										return {
											[relationshipParser.results[0].key]: {
												href: relationshipParser.results[0].href,
												id: obj[el]
											}
										};
									}
								})
								.filter(el => el !== null)
								.reduce((a, b) => {
									return {...a, ...b};
								});
							//console.log(obj.relationships);
						}
						return {
							[element.href]: await generator(apiRoot, {
								...element,
								...obj.relationships[element.href]
							})
						};
					}
				})
			);
			//console.log(response);
			return {
				"@self": obj["@self"],
				...response.reduce((a, b) => {
					return {...a, ...b};
				})
			};
		}
	} catch (error) {
		console.log("[bundler] Error while populating ", query, ":", error);
	}
};

export default generator;
