import generateRouter from "generateRouter";

const aliases = {
	id: "ID",
	ddt: "DDT",
	ammount: "Ammount",
	models: "Item",
	altName: "AltName",
	colors: "Color",
	dueDate: "DueDate",
	packaging: "Packaging",
	highlightColor: "HighlightColor",
	itemKey: "ItemKey"
};

const table = "items";

const router = generateRouter(table, aliases);

export default router;
