import buildRouter from "routerBuilder";
import path from "path";

buildRouter(path.join(__dirname, "../router.js"), path.join(__dirname, "../routes"));