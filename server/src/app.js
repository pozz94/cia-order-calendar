import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import router from "./router";

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

app.use("/api", router("./routes"));

export default app;
