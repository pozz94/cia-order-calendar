import express from "express";
import {query} from "dbUtils";
import {prepareOptions} from "apiUtils";

import generateRouter from "generateRouter";

const aliases = {
	id: "ID",
	name: "Name"
};

const table = "colors";

const router = generateRouter(table, aliases);

export default router;
