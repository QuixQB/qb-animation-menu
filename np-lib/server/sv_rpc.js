const Functions = new Map();
const Promises = new Map();
const Resource = GetCurrentResourceName();
let CallIdentifier = 0;

function rpcRegister(name, func) { 
    Functions.set(name, func)
}

const RPC = {
    'register':rpcRegister,
}

RegisterServerEvent("rpc:request")
on('rpc:request', async (origin, name, callID, params, boolean) => { 
    const src = source
    if (boolean == true) {
        return
    }

    console.log("RPC.JS", origin, name, callID, params, boolean)

    //const [a, b, c, d, e, f, g, h, j, k, l, m, n] = params;
    
    if (!Functions.has(name)) {
        return
    }
    
    const selectFunc = Functions.get(name);
    let response;

    try {
        response = await selectFunc(...params)
    } catch (error) {
        emit("rpc:client:error", Resource, origin, name, error["message"])
    }

    if (typeof response === "undefined") {
        response = [];
    }

    emitNet("rpc:response", src, origin, callID, response, boolean);
})