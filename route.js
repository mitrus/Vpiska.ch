var url = require("url");
var fs = require("fs");

var specialHandlers = {
    testHandler: function(request, response) {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("testHandler in <i>action</i>");
        response.end();
    }
};

function route(request, response) {
    var pathName = url.parse(request.url).pathname.substring(1); // without first "/"
    
    if (pathName in specialHandlers) {
        specialHandlers[pathName](request, response);
    } else {
        notFound(request, response);
    }
}

function notFound(request, response) {
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("<h1>404 Not Found</h1>" + request.url);
    response.end();
}

exports.route = route;