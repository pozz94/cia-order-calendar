var Service = require('node-windows').Service;
var path = require('path');
 
// Create a new service object
var svc = new Service({
  name:'Calendario consegne CIA',
  description: 'web-app di CIA per gestire ordini e consegne',
  script: path.join(__dirname, '../server.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
	],
	env: [
			{
			name: "DB_HOST",
			value: process.env["DB_HOST"]
		},
		{
			name: "DB_PORT",
			value: process.env["DB_PORT"]
		},
		{
			name: "DB_USER",
			value: process.env["DB_USER"]
		},
		{
			name: "DB_PASS",
			value: process.env["DB_PASS"]
		},
		{
			name: "DB_NAME",
			value: process.env["DB_NAME"]
		},
		{
			name: "ROOT_URL",
			value: process.env["ROOT_URL"]
		}
	]
});

module.exports = svc;