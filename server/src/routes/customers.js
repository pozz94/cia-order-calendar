import generateRouter from "./scripts/generateRouter";

const table = "customers";

const aliases = {
	id: "ID",
	name: "Name"
};

const router = generateRouter(table, aliases);

export default router;
