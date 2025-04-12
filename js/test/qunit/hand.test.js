// QUnit test file for Hand class
import { Card, RANKS, SUITS } from '../../card.js';
import { Hand } from '../../hand.js';

// Define a QUnit module for Hand tests
QUnit.module('Hand Tests', {
  beforeEach: function() {
    this.hand = new Hand();
  }
});

// Test setting and getting cards
QUnit.test('setCards() and getCards() should work correctly', function(assert) {
  // Create some test cards
  const card1 = new Card('A', 'Hearts');
  const card2 = new Card('K', 'Spades');
  const card3 = new Card('Q', 'Diamonds');
  
  // Set the cards in the hand
  this.hand.setCards([card1, card2, card3]);
  
  // Get the cards from the hand
  const cards = this.hand.getCards();
  
  // Check that the cards are correct
  assert.equal(cards.length, 3, 'Hand has 3 cards');
  assert.ok(cards.includes(card1), 'Hand includes card1');
  assert.ok(cards.includes(card2), 'Hand includes card2');
  assert.ok(cards.includes(card3), 'Hand includes card3');
  
  // Test setting with non-array
  this.hand.setCards('not an array');
  assert.equal(this.hand.getCards().length, 0, 'Setting with non-array results in empty hand');
  
  // Test setting with empty array
  this.hand.setCards([]);
  assert.equal(this.hand.getCards().length, 0, 'Setting with empty array results in empty hand');
});

// Test sorting cards
QUnit.test('sortCards() sorts the cards with all ranks for each suit', function(assert) {
  // Create cards in random order
  const cards = [
    new Card('K', 'Hearts'),
    new Card('A', 'Spades'),
    new Card('10', 'Diamonds'),
    new Card('Q', 'Clubs'),
    new Card('J', 'Hearts'),
    new Card('2', 'Diamonds')
  ];
  
  // Set the cards in the hand
  this.hand.setCards(cards);
  
  // Sort the cards
  this.hand.sortCards();
  
  // Get the sorted cards
  const sortedCards = this.hand.getCards();
  
  // Check that the cards are sorted by suit first, then by rank
  assert.equal(sortedCards[0].suit, 'Spades', 'First card is a Spade');
  assert.equal(sortedCards[0].rank, 'A', 'First card is Ace of Spades');
  
  assert.equal(sortedCards[1].suit, 'Hearts', 'Second card is a Heart');
  assert.equal(sortedCards[1].rank, 'K', 'Second card is King of Hearts');
  
  assert.equal(sortedCards[2].suit, 'Hearts', 'Third card is a Heart');
  assert.equal(sortedCards[2].rank, 'J', 'Third card is Jack of Hearts');
  
  assert.equal(sortedCards[3].suit, 'Diamonds', 'Fourth card is a Diamond');
  assert.equal(sortedCards[3].rank, '10', 'Fourth card is 10 of Diamonds');
  
  assert.equal(sortedCards[4].suit, 'Diamonds', 'Fifth card is a Diamond');
  assert.equal(sortedCards[4].rank, '2', 'Fifth card is 2 of Diamonds');
  
  assert.equal(sortedCards[5].suit, 'Clubs', 'Sixth card is a Club');
  assert.equal(sortedCards[5].rank, 'Q', 'Sixth card is Queen of Clubs');
});

// Test getting legal plays when following suit
QUnit.test('getLegalPlaysMap() returns only cards of the leading suit when available', function(assert) {
  // Create a hand with cards of different suits
  const heartA = new Card('A', 'Hearts');
  const heart10 = new Card('10', 'Hearts');
  const spadeK = new Card('K', 'Spades');
  const club7 = new Card('7', 'Clubs');
  
  this.hand.setCards([heartA, heart10, spadeK, club7]);
  
  // Set Hearts as the leading suit
  const leadingSuit = 'Hearts';
  const spadesBroken = true;
  
  // Get legal plays
  const legalPlaysMap = this.hand.getLegalPlaysMap(leadingSuit, spadesBroken);
  
  // Check that only Hearts are legal plays
  assert.equal(legalPlaysMap.size, 2, 'There are 2 legal plays');
  assert.ok(legalPlaysMap.has(0), 'Ace of Hearts is a legal play');
  assert.ok(legalPlaysMap.has(1), '10 of Hearts is a legal play');
  assert.notOk(legalPlaysMap.has(2), 'King of Spades is not a legal play');
  assert.notOk(legalPlaysMap.has(3), '7 of Clubs is not a legal play');
});

// Test getting legal plays when not following suit
QUnit.test('getLegalPlaysMap() returns all cards when player has no cards of the leading suit', function(assert) {
  // Create a hand with no Hearts
  const spadeK = new Card('K', 'Spades');
  const spade5 = new Card('5', 'Spades');
  const club7 = new Card('7', 'Clubs');
  
  this.hand.setCards([spadeK, spade5, club7]);
  
  // Set Hearts as the leading suit
  const leadingSuit = 'Hearts';
  const spadesBroken = true;
  
  // Get legal plays
  const legalPlaysMap = this.hand.getLegalPlaysMap(leadingSuit, spadesBroken);
  
  // Check that all cards are legal plays
  assert.equal(legalPlaysMap.size, 3, 'All 3 cards are legal plays');
  assert.ok(legalPlaysMap.has(0), 'King of Spades is a legal play');
  assert.ok(legalPlaysMap.has(1), '5 of Spades is a legal play');
  assert.ok(legalPlaysMap.has(2), '7 of Clubs is a legal play');
});

// Test getting legal plays when leading and spades are not broken
QUnit.test('getLegalPlaysMap() does not allow leading with Spades when spades are not broken', function(assert) {
  // Create a hand with Spades and other suits
  const spadeK = new Card('K', 'Spades');
  const spade5 = new Card('5', 'Spades');
  const club7 = new Card('7', 'Clubs');
  
  this.hand.setCards([spadeK, spade5, club7]);
  
  // No leading suit (player is leading)
  const leadingSuit = null;
  const spadesBroken = false;
  
  // Get legal plays
  const legalPlaysMap = this.hand.getLegalPlaysMap(leadingSuit, spadesBroken);
  
  // Check that only non-Spades are legal plays
  assert.equal(legalPlaysMap.size, 1, 'Only 1 card is a legal play');
  assert.notOk(legalPlaysMap.has(0), 'King of Spades is not a legal play');
  assert.notOk(legalPlaysMap.has(1), '5 of Spades is not a legal play');
  assert.ok(legalPlaysMap.has(2), '7 of Clubs is a legal play');
});

// Test getting legal plays when leading and spades are broken
QUnit.test('getLegalPlaysMap() allows leading with Spades when spades are broken', function(assert) {
  // Create a hand with Spades and other suits
  const spadeK = new Card('K', 'Spades');
  const spade5 = new Card('5', 'Spades');
  const club7 = new Card('7', 'Clubs');
  
  this.hand.setCards([spadeK, spade5, club7]);
  
  // No leading suit (player is leading)
  const leadingSuit = null;
  const spadesBroken = true;
  
  // Get legal plays
  const legalPlaysMap = this.hand.getLegalPlaysMap(leadingSuit, spadesBroken);
  
  // Check that all cards are legal plays
  assert.equal(legalPlaysMap.size, 3, 'All 3 cards are legal plays');
  assert.ok(legalPlaysMap.has(0), 'King of Spades is a legal play');
  assert.ok(legalPlaysMap.has(1), '5 of Spades is a legal play');
  assert.ok(legalPlaysMap.has(2), '7 of Clubs is a legal play');
});

// Test removing a card
QUnit.test('removeCard() removes the specified card from the hand', function(assert) {
  // Create a hand with multiple cards
  const heartA = new Card('A', 'Hearts');
  const heart10 = new Card('10', 'Hearts');
  const spadeK = new Card('K', 'Spades');
  const club7 = new Card('7', 'Clubs');
  
  this.hand.setCards([heartA, heart10, spadeK, club7]);
  
  // Remove a card
  this.hand.removeCard(heart10);
  
  // Check that the card was removed
  const remainingCards = this.hand.getCards();
  assert.equal(remainingCards.length, 3, 'Hand now has 3 cards');
  assert.ok(remainingCards.includes(heartA), 'Ace of Hearts is still in the hand');
  assert.notOk(remainingCards.includes(heart10), '10 of Hearts was removed');
  assert.ok(remainingCards.includes(spadeK), 'King of Spades is still in the hand');
  assert.ok(remainingCards.includes(club7), '7 of Clubs is still in the hand');
  
  // Try to remove a card that's not in the hand
  const diamond2 = new Card('2', 'Diamonds');
  this.hand.removeCard(diamond2);
  
  // Check that the hand is unchanged
  assert.equal(this.hand.getCards().length, 3, 'Hand still has 3 cards');
});

// Test edge cases for getLegalPlaysMap
QUnit.test('getLegalPlaysMap() handles edge cases correctly', function(assert) {
  // Empty hand
  this.hand.setCards([]);
  let legalPlaysMap = this.hand.getLegalPlaysMap('Hearts', true);
  assert.equal(legalPlaysMap.size, 0, 'Empty hand has no legal plays');
  
  // Hand with only Spades, leading with no suit, spades not broken
  const spadeK = new Card('K', 'Spades');
  const spade5 = new Card('5', 'Spades');
  this.hand.setCards([spadeK, spade5]);
  legalPlaysMap = this.hand.getLegalPlaysMap(null, false);
  assert.equal(legalPlaysMap.size, 0, 'No legal plays when hand has only Spades and spades are not broken');
  
  // Hand with only Spades, leading with Hearts, spades not broken
  legalPlaysMap = this.hand.getLegalPlaysMap('Hearts', false);
  assert.equal(legalPlaysMap.size, 2, 'All cards are legal plays when player has no cards of the leading suit');
});
