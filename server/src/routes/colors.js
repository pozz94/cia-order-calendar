import generateRouter from "./scripts/generateRouter";

const table = "colors";

const aliases = {
	id: "ID",
	name: "Name",
	date: "Date"
};

const router = generateRouter(table, aliases);

export default router;
