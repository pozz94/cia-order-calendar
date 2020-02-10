import generateRouter from "generateRouter";

const aliases = {
	id: "ID",
	code: "Code",
	customers: "Customer",
	date: "Date"
};

const table = "ddt";

const router = generateRouter(table, aliases);

export default router;
