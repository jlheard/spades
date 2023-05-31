// runTests.js

import { deckTest } from './deck.test.js';
import { gameTest } from './game.test.js';
import { handTest } from './hand.test.js';

export function runTests() {
  deckTest();
  gameTest();
  handTest();
}

window.addEventListener('DOMContentLoaded', runTests);
