var url = require("url");
var fs = require("fs");

var specialHandlers = {
  testHandler: function(request, response, connection) {
    var randomId = Math.floor(Math.random() * 100000);
    connection.query("INSERT INTO `USER_INFO` SET `vk_id`=" + randomId + ", " + "`token`='token_test'", function(err) {
      if (err) {
        throw err;
      }
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("testHandler in <i>action</i>\t" + randomId);
      response.end();
    });
  }
};

function route(request, response, connection) {
  var pathName = url.parse(request.url).pathname.substring(1); // without first "/"
  if (pathName in specialHandlers) {
    specialHandlers[pathName](request, response, connection);
  } else {
    notFound(request, response, connection);
  }
}

function notFound(request, response, connection) {
  response.writeHead(404, {"Content-Type": "text/html"});
  response.write("<h1>404 Not Found</h1>" + request.url);
  response.end();
}

exports.route = route;