var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

// Serve up chronodoze folder
var serve = serveStatic(__dirname + '/', {'index': ['chrono-doze.html']})

// Create server
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})

// Listen
console.log("chronodoze on http://localhost:8080/")
server.listen(8080)
