import { Game } from './game.js';

function startGame() {
  const game = new Game();
  game.dealHands();
}

startGame();
