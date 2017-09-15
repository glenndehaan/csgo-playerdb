# Counter-Strike Global Offensive Player Database

An app that notify's you when you are playing with someone that you played before.

## Structure
- ES6
- NodeJS
- Simple Node Logger

## Basic Usage
- Install NodeJS 8.0 or higher
- Copy the `gamestate_integration_playerdb.cfg` file to your `Steam\SteamApps\common\Counter-Strike Global Offensive\csgo\cfg` folder
- Run `npm install` in the node folder
- Run `npm run server` in the node folder

Then open up CS::GO and start playing you will see the incoming logs in your command prompt.

## Logging
All logs will be written to the `csgo-playerdb.log` file in the node folder.

To increase the logging to get the RAW incoming data change the logLevel in the `config.js` file from `info` to `debug`.

When you now start your server every incoming data from CS::GO will be saved as a JSON file in the exp folder.

## Database
To make this as simple as it is I use a local Json database.

Checkout `csgo-playerdb.json` since this is the db file.

## License

MIT
