import express from "express";
import {postJson, processJsonResponse, getJson} from "fetchUtils";
import {query, queryExists} from "dbUtils";

const router = express.Router();

router.post("/", (req, res, next) => {
	Promise.all([
		postJson("http://localhost:4000/api/models", req.body.value.Item),
		postJson("http://localhost:4000/api/colors", req.body.value.Color)
	])
		.then(response => {
			return Promise.all(
				response.map(singleRes => processJsonResponse(singleRes))
			);
		})
		.then(([item, color]) => {
			getJson(`http://localhost:4000/api/models/${item.id}`)
				.then(response => processJsonResponse(response))
				.then(json => {
					const ddt = req.vars.id;
					const {
						Ammount,
						Item,
						Date: dueDate,
						Packaging,
						HighlightColor
					} = req.body.value;
					const Highlight = parseInt(HighlightColor.replace("#", "0x") + "ff");
					const itemAlternativeName = json.name === Item.name ? "" : Item.name;
					const key = req.body.key;
					queryExists(
						"SELECT * FROM `items` WHERE `ItemKey` LIKE ?;",
						[key],
						//if there are results
						rows => res.json({...rows[0]}),
						//if there aren't
						() => {
							query(
								`INSERT INTO \`items\` (
									\`DDT\`, 
									\`Ammount\`, 
									\`Item\`, 
									\`AltName\`, 
									\`Color\`, 
									\`DueDate\`, 
									\`Packaging\`, 
									\`HighlightColor\`, 
									\`ItemKey\`)
								VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
								SELECT LAST_INSERT_ID() AS \`id\`;`,
								[
									ddt,
									Ammount,
									Item.id,
									itemAlternativeName,
									color.id,
									dueDate,
									Packaging,
									Highlight,
									key
								],
								rows => res.json({...rows[rows.length - 1][0]})
							);
						}
					);
				})
				.catch(error => {
					console.log("[ddt item api error]", error);
				});
		})
		.catch(error => {
			console.log("[ddt item error]", error);
		});
});

export default router;
