// runTests.js

import { cardTest } from './card.test.js';
import { cardComparerTest } from './cardComparer.test.js';
import { deckTest } from './deck.test.js';
import { gameTest } from './game.test.js';
import { handTest } from './hand.test.js';
import { legalPlayRulesTest } from './legalPlayRules.test.js';

export function runTests() {
  cardTest();
  cardComparerTest();  
  deckTest();
  gameTest();
  handTest();
  legalPlayRulesTest();
}

window.addEventListener('DOMContentLoaded', runTests);
