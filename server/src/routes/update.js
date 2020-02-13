import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
	res.status(200).set({
		"Content-Type": "text/event-stream; charset=utf-8",
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive"
	});
	req.app.on("update", data => {
		res.write(`data: ${JSON.stringify(data)}\n\n`);
	});
});

router.post("/", (req, res, next) => {
	res.app.emit("update", req.body.type);
	res.json({success: true});
	//res.end();
});

export default router;
