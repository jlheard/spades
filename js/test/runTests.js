// runTests.js

import { deckTest } from './deck.test.js';
import { gameTest } from './game.test.js';

export function runTests() {
  deckTest();
  gameTest()
}

window.addEventListener('DOMContentLoaded', runTests);
