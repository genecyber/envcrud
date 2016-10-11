var express = require('express')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router()
var bodyParser = require('body-parser')
var Env = require("./env.js").Env
var env = new Env(".env")
var app = express()
var http = require('http')
var server = http.createServer(app)
var PORT = normalizePort('3002')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
    env.loadVariables(function(envArray){
        if (req.query.key) {
            env.getVariable(req.query.key, function(value){
                res.json({env: value})
            })
        } else {
            res.json({env: envArray})
        }
    })
})
app.post('/', function(req, res){
    if (!req.body.key) {
        res.json({success : false, msg: "Requires a key"})
    } else {
        if (!req.body.value) {
            res.json({success : false, msg: "Requires a value"})
        } else {
            env.AddOrUpdate(req.body.key, req.body.value, function(newVar){
                res.json({success: true, msg: newVar})
            })
        }        
    }
})
app.delete('/', function(req, res){
    if (!req.body.key) {
        res.json({success : false, msg: "Requires a key"})
    } else {
        env.Delete(req.body.key, function(msg){
            res.json({success: true, msg: msg})
        })
    }
})
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
server.listen(PORT)
console.log('Running on http://localhost:' + PORT)
module.exports = router