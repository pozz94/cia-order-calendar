import generateRouter from "./scripts/generateRouter";

const table = "models";

const aliases = {id: "ID", code: "Code", name: "Name"};

const router = generateRouter(table, aliases);

export default router;
