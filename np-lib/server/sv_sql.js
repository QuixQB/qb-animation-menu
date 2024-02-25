const SQL = {};
const PromSQL = {};
let callId = 0;

SQL["execute"] = function (query, ... param) { 
    let idx = callId;
    callId++;

    PromSQL[idx] = new Promise(function(resolve, reject) {
        if (query == "") {
            reject("Query Required")
        }
        exports["ghmattimysql"].execute(query, param, function(result) {
            resolve(result)
        })
        
    });
    
    PromSQL[idx].then (
        function(value) { 
            return value
        }, function(error) { 
            return error
        }
    )
}