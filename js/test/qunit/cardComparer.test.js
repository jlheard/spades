// QUnit test file for CardComparer
import { Card } from '../../card.js';
import { compareCardsForTurn } from '../../cardComparer.js';

// Define a QUnit module for CardComparer tests
QUnit.module('CardComparer Tests');

// Test case: All cards have the same suit, compare their ranks
QUnit.test('Compare cards of the same suit', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Hearts');
  const card2 = new Card('Q', 'Hearts');
  const card3 = new Card('A', 'Hearts');
  const card4 = new Card('J', 'Hearts');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, card3, 'Ace of Hearts should win when all cards are Hearts');
});

// Test case: Lead card is a spade, no other spades present
QUnit.test('Lead card wins if it is a spade and no other spades present', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Spades');
  const card2 = new Card('A', 'Hearts');
  const card3 = new Card('Q', 'Diamonds');
  const card4 = new Card('J', 'Clubs');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, leadCard, 'King of Spades should win as no other spades present');
});

// Test case: Lead card is a spade, other spades present
QUnit.test('Lead card does not win if it is a spade but other spades present', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Spades');
  const card2 = new Card('A', 'Spades');
  const card3 = new Card('Q', 'Diamonds');
  const card4 = new Card('J', 'Clubs');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, card2, 'Ace of Spades should win as it is the highest spade');
});

// Test case: Lead card is not a spade, other spades present
QUnit.test('Lead card does not win if it is not a spade but other spades present', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Hearts');
  const card2 = new Card('A', 'Spades');
  const card3 = new Card('Q', 'Diamonds');
  const card4 = new Card('J', 'Clubs');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, card2, 'Ace of Spades should win as spades trump other suits');
});

// Test case: Lead card is not a spade, no other spades present
QUnit.test('Lead card wins if it is not a spade and no other spades present', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Hearts');
  const card2 = new Card('A', 'Diamonds');
  const card3 = new Card('Q', 'Clubs');
  const card4 = new Card('J', 'Clubs');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, leadCard, 'King of Hearts should win as no spades present and no higher hearts');
});

// Test case: Spades test
QUnit.test('Correct card should win when all spades present', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Spades');
  const card2 = new Card('A', 'Spades');
  const card3 = new Card('Q', 'Spades');
  const card4 = new Card('J', 'Spades');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, card2, 'Ace of Spades should win when all cards are Spades');
});

// Test case: Multiple spades present, but not the lead card
QUnit.test('Highest spade should win when multiple spades present', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Hearts');
  const card2 = new Card('Q', 'Spades');
  const card3 = new Card('A', 'Spades');
  const card4 = new Card('J', 'Spades');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, card3, 'Ace of Spades should win when multiple spades present');
});

// Test case: Jokers
QUnit.test('Jokers should be handled correctly', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Hearts');
  const card2 = new Card('BigJoker', 'Spades');
  const card3 = new Card('ExtraJoker', 'Spades');
  const card4 = new Card('A', 'Hearts');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, card2, 'BigJoker should win as it is the highest ranked card');
});

// Test case: Edge case - only one card
QUnit.test('Should handle a single card correctly', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Hearts');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, leadCard, 'The only card should win');
});

// Test case: Edge case - same rank, different suits
QUnit.test('Should handle same rank, different suits correctly', function(assert) {
  // Arrange
  const leadCard = new Card('K', 'Hearts');
  const card2 = new Card('K', 'Diamonds');
  const card3 = new Card('K', 'Clubs');
  const card4 = new Card('K', 'Spades');
  
  const playerForPlayedCardMap = new Map([
    [leadCard, 'Player 1'],
    [card2, 'Player 2'],
    [card3, 'Player 3'],
    [card4, 'Player 4'],
  ]);
  
  // Act
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert
  assert.strictEqual(winningCard, card4, 'King of Spades should win as spades trump other suits');
});
