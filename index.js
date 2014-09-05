var http = require("http");
var config = require("./config");
var route = require("./route").route;

function startServer(route) {
    function onRequest(request, response) {
        route(request, response);
    }
    http.createServer(onRequest).listen(config.httpPort);
    console.log("Server has started, " + (new Date().toString()));
}

startServer(route);