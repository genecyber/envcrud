# envcrud

Node module to manage .env file
Includes small example webserver to demonstrate use via REST

- Postman API documentation can be found here: https://documenter.getpostman.com/view/617134/envcrud/2MrYL6
- Postman API collection is included: envcrud.postman_collection.json

## Use
`npm install envcrud`

```
var Env = require("envcrud").Env
var env = new Env(".env")
```
### List all entries
```
env.loadVariables(function(envArray){
    console.log(envArray)
})
```
### Get single entry
```
env.getVariable("foo", function(value){
    console.log({env: value})
})
```
### Add or update entry
```
env.AddOrUpdate("foo", "new bar", function(newVar){
    console.log({success: true, msg: newVar})
})
```
### Delete an entry
```
env.Delete("foo", function(msg){
    console.log({success: true, msg: msg})
})
```