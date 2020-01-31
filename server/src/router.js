import express from "express";
import path from "path";
import fs from "fs";

//function to generate the list of routes
const routes = (dir, filelist = [], firstDir = null) => {
	firstDir = firstDir || dir;
	fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? routes(path.join(dir, file), filelist, firstDir)
			: filelist.concat(path.relative(firstDir, path.join(dir, file)));
	});
	return filelist;
};

const router = routesPath => {
	const expressRouter = express.Router();

	//Read each file in the routesPath directory
	routes(path.join(__dirname, routesPath))
		.map(route => {
			// Strip the .js suffix and split by slashes
			const urlSections = route
				.split(".")[0]
				.split(/[\\\/]/)
				.map(dir => {
					if (dir.match(/^\[.*?\]$/m)) dir = ":" + dir.slice(1, -1);
					return dir;
				})
				//Serve index files as father dir. Also removes empty items just to be safe
				.filter(dir => dir !== "index" && dir != "");

			//remove all directories that are in a scripts folder
			if (!urlSections.includes("scripts")) {
				return {
					file: routesPath + "/" + route.replace(/[\\\/]/g, "/"),
					url: "/" + urlSections.join("/"),
					urlSections
				};
			}
		})
		.filter(element => element != null)
		.sort(({urlSections: a}, {urlSections: b}) => {
			for (let i = 0, value; i < a.length && i < b.length; i++) {
				const params = [a, b].map(t => (t[i].startsWith(":") ? 1 : 0)).reduce((a, b) => a - b);
				const regex = [a, b]
					.map(t => (t[i].match(/^:\w+\(\S*\)$/) ? 1 : 0))
					.reduce((a, b) => a - b);
				value = params - regex * 0.1;
				if (value) return value;
			}
			return a.length - b.length;
		})
		.forEach(({url, file}) => {
			//Here it states what it is trying to do
			console.log("\x1b[36m[router] Serving\x1b[35m", url, "\x1b[36mfrom\x1b[35m", file);
			//mount the route
			try {
				//pass params to req.vars since req.params don't work
				expressRouter.use(
					url,
					(req, res, next) => {
						req.vars = {...req.params};
						next();
					},
					require(file).default || require(file)
				);
				//success message
				console.log("\x1b[32mLoaded");
			} catch (err) {
				//fail message
				console.log(
					`\x1b[31m[router] ${path.join(__dirname, file)}
					\x1b[31mThe file doesn't exist or contains errors:
					\x1b[31m${err}`.replace(/^\s+/gm, "")
				);
			}
		});
	return expressRouter;
};

export default router;
