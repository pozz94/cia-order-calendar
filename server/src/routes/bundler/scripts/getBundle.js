import {getJson} from "fetchUtils";
import type from "typeCheck.js";

const getBundle = async (apiRoot, query) => {
	try {
		let newOptions = await Promise.all(
			query.data.map(async element => {
				if (element.options) {
					const value = await getBundle(apiRoot, {...element, data: ["id"]});

					delete element.options;

					return {[element.href]: value.collection.map(el => el.id)};
				}
			})
		);

		newOptions = newOptions
			.filter(element => (element ? true : false))
			.reduce((a, b) => {
				return {...a, ...b};
			}, undefined);

		if (newOptions) {
			query = {
				...query,
				options: {...(query.options || {}), ...(newOptions || {})}
			};
		}

		let params = "";

		if (query.options) {
			params =
				"?" +
				Object.keys(query.options)
					.map(key => `${key}=${encodeURIComponent(JSON.stringify(query.options[key]))}`)
					.join("&");
		}

		const href = apiRoot + "/" + query.href + (query.id ? "/" + query.id : params);

		let obj = await getJson(href).catch(error =>
			console.log("[bundler] Error while getting", href, "on", query, ":\n", error)
		);

		if (obj["@self"] && obj["@self"].type && obj["@self"].type === "collection") {
			return {
				...obj,
				collection: await Promise.all(
					obj.collection.map(item =>
						getBundle(apiRoot, {...query, id: item.replace(href.split("?")[0] + "/", "")})
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
						return {
							[element.href]:
								(await getBundle(apiRoot, {...element, id: obj[element.href]})) || null,
							...() => (obj[element.href] ? null : {error: element.href + " not found"})
						};
					}
				})
			);
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

export default getBundle;
