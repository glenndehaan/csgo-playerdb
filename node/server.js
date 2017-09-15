const http = require('http');
const fs = require('fs');
const JsonDB = require('node-json-db');
const log = require('simple-node-logger').createSimpleLogger('csgo-playerdb.log');
const db = new JsonDB('csgo-playerdb', true, false);
const config = require('./config');

/**
 * Set log level from config
 */
log.setLevel(config.application.logLevel);

/**
 * Set global vars for later use
 * @type {{players: Array, player_ids: Array}}
 */
let general_data = {
    players: [],
    player_ids: []
};

/**
 * Init player object if it doesn't exists
 */
if(Object.keys(db.getData("/")).length === 0 && db.getData("/").constructor === Object){
    db.push("/players", []);
}

/**
 * Create new HTTP server
 */
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});

    req.on('data', (data) => {
        try {
            log.trace(JSON.parse(data.toString()));

            generalProcessData(JSON.parse(data.toString()));

            if (config.application.logLevel === "trace" || config.application.logLevel === "debug") {
                fs.writeFile(`${__dirname}/export/${JSON.parse(data.toString()).provider.timestamp}.json`, data.toString(), (err) => {
                    if (err) {
                        return log.error(`[FILE] Error writing file: ${err}`);
                    }
                });
            }
        } catch (e) {
            log.error(`[WEBDATA] Error retrieving data from API: ${e}`)
        }
    });

    req.on('end', () => {
        res.end('');
    });
});

/**
 * Function to check if the right information exists so the right logger can be triggered
 * @param data
 */
function generalProcessData(data) {
    if (typeof data.player !== "undefined") {
        if (typeof data.player.steamid !== "undefined") {
            processPlayerId(data);
            log.trace("processPlayerId");
        }
    }
}

/**
 * Process when playerid had been found
 * @param data
 */
function processPlayerId(data) {
    if (!general_data.player_ids.includes(data.player.steamid)) {
        general_data.player_ids.push(data.player.steamid);
        general_data.players.push({id: data.player.steamid, name: data.player.name});

        const found = db.getData("/players").some((el) => {
            return el.id === data.player.steamid;
        });

        if (found) {
            log.info(`[PLAYER] Hey you already played with this player: ${data.player.steamid} (${data.player.name})!!`);
        } else {
            log.info(`[PLAYER] New player found: ${data.player.steamid} (${data.player.name})`);
            db.push("/players[]", {id: data.player.steamid, name: data.player.name});
        }

        log.trace(`playersInDB: ${JSON.stringify(db.getData("/players"))}`);
    }
}

/**
 * Start listening on the right port/host for the HTTP server
 */
server.listen(config.application.port, config.application.host);
log.info(`[SYSTEM] Monitoring CS:GO on: ${config.application.host}:${config.application.port}`);
