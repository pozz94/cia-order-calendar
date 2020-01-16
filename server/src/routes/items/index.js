import express from "express";
import {postJson, processJsonResponse} from "fetchUtils";
import {query} from "dbUtils";

const router = express.Router();

router.get("/", function(req, res, next) {
	query(
		"SELECT `ID` AS id FROM `items`",
		[],
		async items => {
			res.json({
				"@self": {url: req.currentUrl, type: "collection"},
				collection: items.map(item => req.currentUrl + "/" + item.id)
			});
		}
	);
});

router.post("/", (req, res, next) => {
	postJson("http://localhost:4000/api/ddt", req.body.ddtData)
		.then(response => processJsonResponse(response))
		.then(response =>
			Promise.all(
				req.body.Items.map(item =>
					postJson(`http://localhost:4000/api/ddt/${response.id}/items`, item)
						.then(response => {
							return processJsonResponse(response);
						})
						.catch(error => {
							console.log("[list api error]", error);
						})
				)
			)
		)
		.then(items => {
			postJson(`http://localhost:4000/api/update`, {
				type: "list"
			}).catch(error => {
				console.log("[list api error]", error);
			});
			return res.status(200).json(items);
		})
		.catch(error => {
			console.log("[list api error]", error);
		});
});

export default router;
