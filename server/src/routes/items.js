import generateRouter from "./scripts/generateRouter";

const table = "items";

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
	itemKey: "ItemKey",
	status: "Status",
	oldStatus: "OldStatus",
};

const router = generateRouter(table, aliases, "`DDT` IS NOT NULL AND `DDT` != 0");

export default router;
