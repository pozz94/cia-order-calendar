import express from "express";
import {query} from "dbUtils";
import {prepareOptions} from "apiUtils";

const generateRouter = (table, aliases) => {
	const router = express.Router();

	router.get("/", (req, res, next) => {
		const options = prepareOptions(req.query, aliases);
		query(`SELECT \`ID\` AS id FROM \`${table}\` ${options}`, [], async items => {
			res.json({
				"@self": {url: req.currentUrl, type: "collection"},
				collection: items.map(item => req.currentUrl.split("?")[0] + "/" + item.id)
			});
		});
	});

	router.post("/", (req, res, next) => {
		const aliasesArray = Object.keys(aliases).filter(element =>
			element !== "id" && req.body[element] ? true : false
		);

		const columns = aliasesArray.map(element => aliases[element]).join(", ");

		const values = aliasesArray.map(element => req.body[element]);

		query(
			`INSERT INTO \`${table}\` (${columns}) VALUES (${aliasesArray
				.map(() => "?")
				.join(", ")}); SELECT LAST_INSERT_ID() AS id;`,
			values,
			items => {
				const id = items[items.length - 1][0].id;
				res.json({url: [req.currentUrl, id].join("/"), id});
			}
		);
	});

	router.get("/:id([0-9]+)", (req, res, next) => {
		const aliasesArray = Object.keys(aliases);

		const columns = aliasesArray.map(element => `\`${aliases[element]}\` AS ${element}`).join(", ");

		query(
			`SELECT ${columns} FROM \`${table}\` WHERE \`ID\` = ?`,
			[parseInt(req.params.id)],
			rows => {
				if (rows.length)
					res.json({"@self": {url: req.currentUrl, type: "object"}, ...rows[rows.length - 1]});
				else res.status(404).json({error: "not found"});
			}
		);
	});

	router.put("/:id([0-9]+)", (req, res, next) => {
		const aliasesArray = Object.keys(aliases).filter(element =>
			element !== "id" && req.body[element] ? true : false
		);

		const columns = aliasesArray.map(element => `\`${aliases[element]}\`=?`).join(", ");

		const values = aliasesArray.map(element => req.body[element]);

		const id = parseInt(req.params.id);

		query(`UPDATE \`${table}\` SET ${columns} WHERE \`ID\`= ?`, [...values, id], () =>
			res.json({url: req.currentUrl, id})
		);
	});

	router.delete("/:id([0-9]+)", (req, res, next) => {
		const id = parseInt(req.params.id);

		query(`DELETE FROM \`${table}\` WHERE \`${aliases["id"]}\` = ?`, [id], ans => {
			if (ans.affectedRows !== 0) res.json({success: "Yeah!!!"});
			else res.status(404).json({error: "not found"});
		});
	});

	return router;
};

export default generateRouter;
