const { Server } = require("boardgame.io/server");
const { Game } = require("./Game.js");
//import { GAME_SERVER_PORT } from "./config.js";
const server = Server({
  games: [Game],
});

server.run(8000);