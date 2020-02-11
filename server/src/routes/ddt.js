import generateRouter from "./scripts/generateRouter";

const table = "ddt";

const aliases = {
	id: "ID",
	code: "Code",
	customers: "Customer",
	date: "Date"
};

const router = generateRouter(table, aliases);

export default router;
