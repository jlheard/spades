import { Game } from './game.js';
import { Turn } from './turn.js';

const game = new Game();
const playerHandElement = document.getElementById('player-hand');

const turn = new Turn(game.players, playerHandElement);
