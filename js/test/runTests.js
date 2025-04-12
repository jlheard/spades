// runTests.js

import { cardTest } from './card.test.js';
import { cardComparerTest } from './cardComparer.test.js';
import { deckTest } from './deck.test.js';
import { gameTest } from './game.test.js';
import { handTest } from './hand.test.js';
import { legalPlayRulesTest } from './legalPlayRules.test.js';
import { playerTest } from './player.test.js';
import { playStrategyTest } from './stratagies/play/playStrategy.test.js';
import { trickFlowIntegrationTest } from './integration/trickFlow.test.js';

export function runTests() {
  cardTest();
  cardComparerTest();  
  deckTest();
  gameTest();
  handTest();
  legalPlayRulesTest();
  playStrategyTest();
  playerTest();
  
  // Run integration tests
  console.log('Running integration tests...');
  trickFlowIntegrationTest();
}

window.addEventListener('DOMContentLoaded', runTests);
