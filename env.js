// ------- Created By Shannon Code

var fs = require("fs")
var filename
var Env = function (file) {
    filename = file
    this.filename = file
}

Env.prototype.loadVariables = function(cb) {
    Env.envArray = []
    fs.readFile(Env.filename || '.env', (err, data) => {
        if (err) throw err;
        var env = data.toString()
        env = env.replace(" = ", "=")
        env = env.split("\n")
        for (variable in env) {
            var kvp = env[variable].split("=")
            if (kvp[0] !== "")
                Env.envArray[variable] = { key: kvp[0].trim(), value: kvp[1].trim() }
        }
        return cb(Env.envArray)
    })
}

Env.prototype.getVariables = function() {
    return Env.envArray
}

Env.prototype.getVariable = function(needle, cb) {    
    var variable = Env.envArray.filter(function(item){
        return item.key === needle
    })[0]
    return cb(variable || {})
}

Env.prototype.AddOrUpdate = function(key, value, cb) {
    var add = function(details){
        Env.envArray[details.index].value = value
        Env.prototype.save(filename, function(result){
            return cb(result)
        })
    }
    for (variable in Env.envArray) {
        if (Env.envArray[variable].key === key) {
            return add({item: Env.envArray[variable], index: variable })
        }
    }
    var newItem = {key: key, value: value}
    Env.envArray[Env.envArray.length] = newItem
    Env.prototype.save(filename, function(result){
        return cb(result)
    })
}

Env.prototype.Delete = function(key, cb) {
    var variable = Env.envArray.filter(function(item){
        return item.key === key
    })[0]
    var sliced = []
    Env.envArray.filter(function(item){
        if (item.key !== key) {
            sliced.push(item)
        }
        return sliced
    })
    Env.envArray = sliced
    Env.prototype.save(filename, function(result){
        return cb(result)
    })    
}

Env.prototype.save = function(filename, cb) {
    var fileData = ""
    for (variable in Env.envArray) {
        var rowItem = Env.envArray[variable]
        fileData = fileData + rowItem.key + "=" + rowItem.value + "\n"
    }
    console.log("filename", filename)
    fs.writeFile(filename, fileData, 
        function(err){
            if (err) {
                return cb(err)
            } else {
                return cb("Save complete")
            }
        }
    )
}

exports.Env = Env
/******    Use   *******

var env = new Env(".env")
env.loadVariables(function(envArray){
    env.AddOrUpdate("BLUEMIX", false, function(variable){
       
    })
})
*/