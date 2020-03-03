import express from "express";
import {query} from "dbUtils";
import {prepareOptions} from "apiUtils";
import {postJson} from "fetchUtils";

const generateRouter = (table, aliases, where=null) => {
	const router = express.Router();

	router.get("/", (req, res, next) => {
		let options = prepareOptions(req.query, aliases);
		if (options && options !== "" && where) {
			options += " AND " + where;
		} else if(where){
			options = "WHERE " + where;
		}
		console.log(`SELECT \`ID\` AS id FROM \`${table}\` ${options}`);
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

		let columns, updates, values;

		aliasesArray.forEach(element => {
			columns = [...(columns || []), aliases[element]];
			updates = [...(updates || []), `\`${aliases[element]}\`=?`];
			values = [...(values || []), req.body[element]];
		});

		columns = columns && columns.join(", ");
		updates = updates && updates.join(", ");

		query(
			`
				INSERT INTO \`${table}\` (${columns}) 
					VALUES (${aliasesArray.map(() => "?").join(", ")})
					ON DUPLICATE KEY UPDATE
						\`${aliases["id"]}\` = LAST_INSERT_ID(\`${aliases["id"]}\`),
						${updates};
				SELECT LAST_INSERT_ID() AS id;
			`.replace(/\s+/g, " "),
			[...values, ...values],
			items => {
				postJson(req.rootUrl + "/update", {type: table});
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

		let updates, values;

		aliasesArray.forEach(element => {
			updates = [...(updates || []), `\`${aliases[element]}\`=?`];
			values = [...(values || []), req.body[element]];
		});

		updates = updates.join(", ");

		const id = parseInt(req.params.id);

		query(`UPDATE \`${table}\` SET ${updates} WHERE \`ID\`= ?`, [...values, id], () => {
			postJson(req.rootUrl + "/update", {
				type: table
			});
			res.json({url: req.currentUrl, id});
		});
	});

	router.delete("/:id([0-9]+)", (req, res, next) => {
		const id = parseInt(req.params.id);

		query(`DELETE FROM \`${table}\` WHERE \`${aliases["id"]}\` = ?`, [id], ans => {
			postJson(req.rootUrl + "/update", {
				type: table
			});
			if (ans.affectedRows !== 0) res.json({success: "Yeah!!!"});
			else res.status(404).json({error: "not found"});
		});
	});

	return router;
};

export default generateRouter;
