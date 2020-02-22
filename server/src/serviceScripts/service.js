var Service = require("node-windows").Service;
var path = require("path");
var readlineSync = require("readline-sync");

// Create a new service object
function service(getEnv = false) {
	var env = [];
	if (getEnv) {
		env.push({name: "DB_HOST", value: readlineSync.question("DB Host IP: ")});
		env.push({name: "DB_PORT", value: readlineSync.question("DB PORT Number: ")});
		env.push({name: "DB_USER", value: readlineSync.question("DB Username: ")});
		env.push({
			name: "DB_PASS",
			value: readlineSync.question("DB Password: ", {hideEchoBack: true})
		});
		env.push({name: "DB_NAME", value: readlineSync.question("DB Name: ")});
		env.push({name: "ROOT_URL", value: readlineSync.question("URL from which to serve the API: ")});
	}
	var svc = new Service({
		name: "Calendario consegne CIA",
		description: "web-app di CIA per gestire ordini e consegne",
		script: path.join(__dirname, "../server.js"),
		nodeOptions: ["--harmony", "--max_old_space_size=4096"],
		env: env
	});
	return svc;
}

module.exports = service;
