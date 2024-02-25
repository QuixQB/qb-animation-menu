SQL = SQL or {}
local CallSqlId = 0
local PromisesSQL = {}

function Await(pPromise)
    return Citizen.Await(pPromise)
end

SQL.execute = function(pQuery, pParam)
    local param = nil

    if pParam == nil then
        param = {}
    else
        param = pParam
    end

    local callID = CallSqlId
    CallSqlId = CallSqlId + 1
    PromisesSQL[callID] = promise.new()
    
    exports["ghmattimysql"]:execute(pQuery, param, function(result)
        PromisesSQL[callID]:resolve(result)
    end)

    return PromisesSQL[callID]
end

--[[
SQL.executedynamicparam = function(query, ...)
    local callID = CallSqlId
    CallSqlId = CallSqlId + 1
    PromisesSQL[callID] = promise.new()

    exports["ghmattimysql"]:execute(query, {...}, function(result)
        PromisesSQL[callID]:resolve(result)
    end)

    return PromisesSQL[callID]
end
]]--

SQL.scalar = function(pQuery, pParam)
    local param = nil

    if pParam == nil then
        param = {}
    else
        param = pParam
    end

    local callID = CallSqlId
    CallSqlId = CallSqlId + 1
    PromisesSQL[callID] = promise.new()

    exports["ghmattimysql"]:scalar(pQuery, param, function(result)
        PromisesSQL[callID]:resolve(result)
    end)

    return PromisesSQL[callID]
end

--[[
SQL.scalardynamicparam = function(query, ...)
    local callID = CallSqlId
    CallSqlId = CallSqlId + 1
    PromisesSQL[callID] = promise.new()
    
    exports["ghmattimysql"]:scalar(query, {...}, function(result)
        PromisesSQL[callID]:resolve(result)
    end)

    return PromisesSQL[callID]
end
]]--