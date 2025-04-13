// QUnit integration test for card comparison
import { Card, RANKS } from '../../../card.js';
import { compareCardsForTurn } from '../../../cardComparer.js';

// Define a QUnit module for card comparison tests
QUnit.module('Integration - Card Comparison', {
  beforeEach: function() {
    // Set up any necessary test data
  }
});

// Test that higher-ranked cards of the same suit win
QUnit.test('Higher-ranked cards of the same suit should win', function(assert) {
  // Create a map of cards and players
  const playerForPlayedCardMap = new Map();
  
  // Create test cards
  const tenOfDiamonds = new Card('10', 'Diamonds');
  const fiveOfDiamonds = new Card('5', 'Diamonds');
  const aceOfHearts = new Card('A', 'Hearts');
  const kingOfHearts = new Card('K', 'Hearts');
  
  // Test case 1: 10 of Diamonds vs 5 of Diamonds (10 should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(tenOfDiamonds, { name: 'Player' });
  playerForPlayedCardMap.set(fiveOfDiamonds, { name: 'West' });
  
  const winningCard1 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard1, tenOfDiamonds, '10 of Diamonds should beat 5 of Diamonds');
  
  // Test case 2: 5 of Diamonds vs 10 of Diamonds (10 should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(fiveOfDiamonds, { name: 'Player' });
  playerForPlayedCardMap.set(tenOfDiamonds, { name: 'West' });
  
  const winningCard2 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard2, tenOfDiamonds, '10 of Diamonds should beat 5 of Diamonds (regardless of play order)');
  
  // Test case 3: Ace of Hearts vs King of Hearts (Ace should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(aceOfHearts, { name: 'Player' });
  playerForPlayedCardMap.set(kingOfHearts, { name: 'West' });
  
  const winningCard3 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard3, aceOfHearts, 'Ace of Hearts should beat King of Hearts');
  
  // Test case 4: King of Hearts vs Ace of Hearts (Ace should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(kingOfHearts, { name: 'Player' });
  playerForPlayedCardMap.set(aceOfHearts, { name: 'West' });
  
  const winningCard4 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard4, aceOfHearts, 'Ace of Hearts should beat King of Hearts (regardless of play order)');
});

// Test that spades beat other suits
QUnit.test('Spades should beat other suits', function(assert) {
  // Create a map of cards and players
  const playerForPlayedCardMap = new Map();
  
  // Create test cards
  const twoOfSpades = new Card('2', 'Spades');
  const aceOfHearts = new Card('A', 'Hearts');
  const aceOfDiamonds = new Card('A', 'Diamonds');
  const aceOfClubs = new Card('A', 'Clubs');
  
  // Test case 1: 2 of Spades vs Ace of Hearts (2 of Spades should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(aceOfHearts, { name: 'Player' });
  playerForPlayedCardMap.set(twoOfSpades, { name: 'West' });
  
  const winningCard1 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard1, twoOfSpades, '2 of Spades should beat Ace of Hearts');
  
  // Test case 2: Ace of Diamonds vs 2 of Spades (2 of Spades should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(aceOfDiamonds, { name: 'Player' });
  playerForPlayedCardMap.set(twoOfSpades, { name: 'West' });
  
  const winningCard2 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard2, twoOfSpades, '2 of Spades should beat Ace of Diamonds');
  
  // Test case 3: Ace of Clubs vs 2 of Spades (2 of Spades should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(aceOfClubs, { name: 'Player' });
  playerForPlayedCardMap.set(twoOfSpades, { name: 'West' });
  
  const winningCard3 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard3, twoOfSpades, '2 of Spades should beat Ace of Clubs');
});

// Test that the highest spade wins
QUnit.test('Highest spade should win', function(assert) {
  // Create a map of cards and players
  const playerForPlayedCardMap = new Map();
  
  // Create test cards
  const aceOfSpades = new Card('A', 'Spades');
  const kingOfSpades = new Card('K', 'Spades');
  const queenOfSpades = new Card('Q', 'Spades');
  const twoOfSpades = new Card('2', 'Spades');
  
  // Test case 1: Ace of Spades vs King of Spades (Ace should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(aceOfSpades, { name: 'Player' });
  playerForPlayedCardMap.set(kingOfSpades, { name: 'West' });
  
  const winningCard1 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard1, aceOfSpades, 'Ace of Spades should beat King of Spades');
  
  // Test case 2: King of Spades vs Ace of Spades (Ace should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(kingOfSpades, { name: 'Player' });
  playerForPlayedCardMap.set(aceOfSpades, { name: 'West' });
  
  const winningCard2 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard2, aceOfSpades, 'Ace of Spades should beat King of Spades (regardless of play order)');
  
  // Test case 3: Queen of Spades vs 2 of Spades (Queen should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(queenOfSpades, { name: 'Player' });
  playerForPlayedCardMap.set(twoOfSpades, { name: 'West' });
  
  const winningCard3 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard3, queenOfSpades, 'Queen of Spades should beat 2 of Spades');
});

// Test that the highest card of the leading suit wins when no spades are played
QUnit.test('Highest card of the leading suit should win when no spades are played', function(assert) {
  // Create a map of cards and players
  const playerForPlayedCardMap = new Map();
  
  // Create test cards
  const aceOfHearts = new Card('A', 'Hearts');
  const kingOfHearts = new Card('K', 'Hearts');
  const aceOfDiamonds = new Card('A', 'Diamonds');
  const aceOfClubs = new Card('A', 'Clubs');
  
  // Test case 1: Ace of Hearts vs King of Hearts vs Ace of Diamonds vs Ace of Clubs (Ace of Hearts should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(aceOfHearts, { name: 'Player' });
  playerForPlayedCardMap.set(kingOfHearts, { name: 'West' });
  playerForPlayedCardMap.set(aceOfDiamonds, { name: 'North' });
  playerForPlayedCardMap.set(aceOfClubs, { name: 'East' });
  
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard, aceOfHearts, 'Ace of Hearts should win when Hearts is the leading suit');
});

// Test that jokers beat all other cards
QUnit.test('Jokers should beat all other cards', function(assert) {
  // Create a map of cards and players
  const playerForPlayedCardMap = new Map();
  
  // Create test cards
  const bigJoker = new Card('BigJoker', 'Spades');
  const extraJoker = new Card('ExtraJoker', 'Spades');
  const aceOfSpades = new Card('A', 'Spades');
  const aceOfHearts = new Card('A', 'Hearts');
  
  // Test case 1: Big Joker vs Ace of Spades (Big Joker should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(bigJoker, { name: 'Player' });
  playerForPlayedCardMap.set(aceOfSpades, { name: 'West' });
  
  const winningCard1 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard1, bigJoker, 'Big Joker should beat Ace of Spades');
  
  // Test case 2: Extra Joker vs Ace of Hearts (Extra Joker should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(extraJoker, { name: 'Player' });
  playerForPlayedCardMap.set(aceOfHearts, { name: 'West' });
  
  const winningCard2 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard2, extraJoker, 'Extra Joker should beat Ace of Hearts');
  
  // Test case 3: Big Joker vs Extra Joker (Big Joker should win)
  playerForPlayedCardMap.clear();
  playerForPlayedCardMap.set(bigJoker, { name: 'Player' });
  playerForPlayedCardMap.set(extraJoker, { name: 'West' });
  
  const winningCard3 = compareCardsForTurn(playerForPlayedCardMap);
  assert.equal(winningCard3, bigJoker, 'Big Joker should beat Extra Joker');
});

// Test specific case: 10 of Diamonds vs 5 of Diamonds
QUnit.test('10 of Diamonds should beat 5 of Diamonds', function(assert) {
  // Create a map of cards and players
  const playerForPlayedCardMap = new Map();
  
  // Create test cards
  const tenOfDiamonds = new Card('10', 'Diamonds');
  const fiveOfDiamonds = new Card('5', 'Diamonds');
  
  // Test case: 10 of Diamonds vs 5 of Diamonds (10 should win)
  playerForPlayedCardMap.set(tenOfDiamonds, { name: 'Player' });
  playerForPlayedCardMap.set(fiveOfDiamonds, { name: 'West' });
  
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Log the comparison details
  console.log('10 of Diamonds index:', RANKS.indexOf('10'));
  console.log('5 of Diamonds index:', RANKS.indexOf('5'));
  console.log('Winning card:', winningCard.rank, 'of', winningCard.suit);
  
  assert.equal(winningCard, tenOfDiamonds, '10 of Diamonds should beat 5 of Diamonds');
});
