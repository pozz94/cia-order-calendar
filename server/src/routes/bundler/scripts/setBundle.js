import type from "typeCheck";
import {postJson, putJson} from "fetchUtils";

const setBundle = async (rootUrl, bundle) => {
	const self = bundle["@self"];

	delete bundle["@self"];

	let newBundle = await Promise.all(
		Object.keys(bundle).map(async element => {
			if (
				type(bundle[element]) === "string" ||
				type(bundle[element]) === "number" ||
				type(bundle[element]) === "boolean"
			) {
				return {[element]: bundle[element]};
			} else if (type(bundle[element]) === "object") {
				let response;
				if (bundle[element]["@self"] && bundle[element]["@self"].url) {
					response = await putJson(
						bundle[element]["@self"].url,
						await setBundle(rootUrl, bundle[element])
					);
				} else {
					response = await postJson(
						`${rootUrl}/${element}`,
						await setBundle(rootUrl, bundle[element])
					);
				}
				return {[element]: response.id};
			}
		})
	);

	return {
		"@self": self || undefined,
		...newBundle.reduce((a, b) => {
			return {...a, ...b};
		}, {})
	};
};

export default setBundle;
