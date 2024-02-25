function getCharacterId(serverId)
    local user = exports["np-base"]:getModule("Player"):GetUser(serverId)

    if not user then
        return false, "Couldn't find a character"
    end

    return true, user.character.id
end

function getCharacterJob(serverId)
    local serverId = source
    local user = exports["np-base"]:getModule("Player"):GetUser(serverId)

    if not user then
        return false, "Couldn't find a job or a character"
    end

    return true, user:getVar("job")
end

function getCharacterIdByPhoneNumber(pPhoneNumber)
    if not pPhoneNumber then
        return false, "Phone Number required."
    end

    local query = [[
        SELECT cid FROM _character_phone_number WHERE phone_number = ? AND is_burner = false
    ]]

    local characterId = Await(SQL.scalardynamicparam(query,pPhoneNumber))

    return characterId ~= nil and true or false, characterId or 'No Phone Number'
end