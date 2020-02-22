var svc = require("./service.js")(true);

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
	svc.start();
});

svc.install();