import generateRouter from "generateRouter";

const aliases = {
	id: "ID",
	name: "Name"
};

const table = "customers";

const router = generateRouter(table, aliases);

export default router;
