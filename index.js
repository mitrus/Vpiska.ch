var http    = require("http");
var config  = require("./config");
var route   = require("./route").route;
var mysql   = require("mysql");

function startServer(route) {
  var connection = mysql.createConnection({
    host     : config.db_config.db_host,
    port     : config.db_config.db_port,
    user     : config.db_config.user_name,
    password : config.db_config.password,
    database : config.db_config.database
  });
  connection.connect(function(err) {
    if (err) {
      throw "Error in connection to DB. Check config.js.";
    }
    function onRequest(request, response) {
      route(request, response, connection);
    }

    http.createServer(onRequest).listen(config.httpPort);
    console.log("Server has started, " + (new Date().toString()));
  });

}

startServer(route);