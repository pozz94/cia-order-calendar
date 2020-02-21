import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import router from "./router";
import fs from "fs";
import path from "path"

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use((req, res, next) => {
	req.currentUrl = process.env.ROOT_URL + req.originalUrl;
	req.rootUrl = process.env.ROOT_URL + "/api";
	next();
});

app.use("/api", router);

const buildPath = path.join(__dirname, '../client', 'index.html');

if (!process.env.NODE_ENV==="development" && fs.existsSync(buildPath)) {
	app.get("/*", (req, res) =>
		res.sendFile(buildPath)
	);
}

export default app;
