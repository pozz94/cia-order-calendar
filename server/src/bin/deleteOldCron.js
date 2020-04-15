import { getJson } from "fetchUtils";
import cron from "node-cron";

console.log("starting cron job that deletes old items");

const remove = () => {
	console.log("deleting old items");
	getJson(process.env.ROOT_URL + "/api/remove-old")
}

remove();

cron.schedule(
	"0 13 * * *",
	remove
);