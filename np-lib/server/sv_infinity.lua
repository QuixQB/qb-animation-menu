function GetPlayerCoords(pServerId)
    return exports['np-infinity']:GetPlayerCoords(pServerId)
end

function GetNearbyPlayers(pCoords, pRadius)
    local pData = exports["np-infinity"]:GetPlayersCoords()
    local rData = {}

    for k, v in pairs(pData) do
        if #(vector3(pCoords.x, pCoords.y, pCoords.z) - vector3(v.x, v.y, v.z)) < pRadius then
            table.insert(rData, k)
        end
    end

    return rData
end