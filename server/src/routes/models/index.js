import generateRouter from "generateRouter";

const aliases = {id: "ID", code: "Code", name: "Name"};

const table = "models";

const router = generateRouter(table, aliases);

export default router;
