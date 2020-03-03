import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import router from "./router";
import path from "path";

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

const buildPath = path.join(__dirname, "client");

if (!process.env.NODE_ENV || (process.env.NODE_ENV && process.env.NODE_ENV !== "development")) {
	console.log(buildPath);
	app.use(express.static(buildPath));
	app.get("*", (req, res) => res.sendFile("index.html", { root: buildPath }));
}

export default app;
