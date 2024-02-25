const QBCore = exports['qb-core'].GetCoreObject();

NPX.Procedures.register("emotes:getMeta", function () {
    // Burada emote meta verilerini hazırla veya al
    var emoteMeta = {
        animSet: "default",
        expression: "default",
        quickEmotes: ["sit"]
    };

    // Hazırlanan verileri döndür
    return emoteMeta;
});

NPX.Procedures.register("emotes:setFavorite", function (pSrc, pFavorite) {
    let user = QBCore.Functions.GetPlayer(pSrc);
    let characterId = user.PlayerData.citizenid;

    const { category, index, type, value } = pFavorite;

    // Check if the emote entry already exists for the player
    exports["oxmysql"].execute("SELECT id, emote_value FROM player_emotes WHERE player_id = ? AND emote_category = ? AND emote_index = ? AND emote_type = ?", [characterId, category, index, type], function (result) {
        if (result && result.length > 0) {
            // If the entry exists, check if it has the same value as the one sent
            if (result[0].emote_value === value) {
                // If the value is the same, delete the entry (unfav)
                exports["oxmysql"].execute("DELETE FROM player_emotes WHERE id = ?", [result[0].id], function () {
                    console.log("Deleted emote entry");
                });
            } else {
                // If the value is different, update the entry with the new value (fav)
                exports["oxmysql"].execute("UPDATE player_emotes SET emote_value = ? WHERE id = ?", [value, result[0].id], function () {
                    console.log("Updated emote entry");
                });
            }
        } else {
            // If the entry does not exist, insert a new one (fav)
            exports["oxmysql"].execute("INSERT INTO player_emotes (player_id, emote_category, emote_index, emote_type, emote_value) VALUES (?, ?, ?, ?, ?)", [characterId, category, index, type, value], function () {
                console.log("Inserted new emote entry");
            });
        }
    });

    return true;
});



// Check if the emote exists for a given citizen ID
function checkExistenceEmote(citizenId, cb) {
    exports["oxmysql"].execute("SELECT id FROM player_emotes WHERE player_id = ?", [citizenId], function (result) {
        let exists = result && result.length > 0;
        cb(exists);
    });
}

// Get the emotes for a given citizen ID
NPX.Procedures.register("emotes:getFavorites", function (pSrc) {
    let user = QBCore.Functions.GetPlayer(pSrc);
    let characterId = user.PlayerData.citizenid;

    if (!characterId) return null;

    return new Promise((resolve, reject) => {
        // Check if the emotes exist for the given citizen ID
        checkExistenceEmote(characterId, function (exists) {
            if (exists) {
                // Retrieve the emotes for the given citizen ID
                exports["oxmysql"].execute("SELECT * FROM player_emotes WHERE player_id = ?", [characterId], function (result) {
                    let emotesData = result.map(row => ({
                        category: row.emote_category,
                        index: row.emote_index,
                        type: row.emote_type,
                        value: row.emote_value
                    }));
                    resolve(emotesData);
                });
            } else {
                // No emotes found for the given citizen ID
                resolve([]);
            }
        });
    });
});





onNet('emotes:set:animSet', (pAnimSet) => {
    console.log("pAnimSet: ", pAnimSet)
});

onNet('emotes:set:expression', (pExpression) => {
    console.log("pExpression: ", pExpression)
});

onNet('emotes:set:quickEmote', (pQuick, pQuickEmote) => {
    console.log("pQuick, pQuickEmote: ", pQuick, pQuickEmote)
});