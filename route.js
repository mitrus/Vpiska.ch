var url = require("url");
var fs = require("fs");

var specialApiHandlers = {
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
  },
  addParty: function(request, response, connection) {
    var query = url.parse(request.url, true).query;
    if (!("name" in query) || !/^[а-я]$/.test(query.name)) {
      return false;
    }
    //connection.query("INSERT INTO `parties` SET");
  }
};

function route(request, response, connection) {
  var pathName = url.parse(request.url).pathname.substring(1); // without first "/"
  if (pathName.length >= 4 && pathName.substr(0, 4) == 'api/' && pathName.substr(4) in specialApiHandlers) {
    specialApiHandlers[pathName.substr(4)](request, response, connection);
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