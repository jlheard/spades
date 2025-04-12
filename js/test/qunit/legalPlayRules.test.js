// QUnit test file for LegalPlayRules class
import { LegalPlayRules } from '../../legalPlayRules.js';
import { Card } from '../../card.js';

// Define a QUnit module for LegalPlayRules tests
QUnit.module('LegalPlayRules Tests');

// Test playing same suit card
QUnit.test('isCardLegalToPlay() returns true for playing same suit card', function(assert) {
  // Arrange
  const card = new Card('A', 'Hearts');
  const leadingSuit = 'Hearts';
  const spadesBroken = true;
  const handDoesNotHaveLeadingSuit = false;
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, true, 'Playing same suit card is legal');
});

// Test playing Spades when Spades are broken and player does not have the leading suit
QUnit.test('isCardLegalToPlay() returns true for playing Spades when Spades are broken and player does not have the leading suit', function(assert) {
  // Arrange
  const card = new Card('5', 'Spades');
  const leadingSuit = 'Diamonds';
  const spadesBroken = true;
  const handDoesNotHaveLeadingSuit = true;
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, true, 'Playing Spades when Spades are broken and player does not have the leading suit is legal');
});

// Test playing Spades when Spades are not broken and player does not have the leading suit
QUnit.test('isCardLegalToPlay() returns true for playing Spades when Spades are not broken and player does not have the leading suit', function(assert) {
  // Arrange
  const card = new Card('5', 'Spades');
  const leadingSuit = 'Diamonds';
  const spadesBroken = false;
  const handDoesNotHaveLeadingSuit = true;
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, true, 'Playing Spades when Spades are not broken and player does not have the leading suit is legal');
});

// Test playing Spades when player has the leading suit (reneging)
QUnit.test('isCardLegalToPlay() returns false when player reneges by playing Spades when player has the leading suit', function(assert) {
  // Arrange
  const card = new Card('5', 'Spades');
  const leadingSuit = 'Diamonds';
  const spadesBroken = true; // Even if spades are broken
  const handDoesNotHaveLeadingSuit = false;
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, false, 'Playing Spades when player has the leading suit is illegal (reneging)');
});

// Test playing any suit when player has no cards of the leading suit
QUnit.test('isCardLegalToPlay() returns true for playing any suit when player has no cards of the leading suit', function(assert) {
  // Arrange
  const card = new Card('J', 'Clubs');
  const leadingSuit = 'Spades';
  const spadesBroken = true;
  const handDoesNotHaveLeadingSuit = true;
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, true, 'Playing any suit when player has no cards of the leading suit is legal');
});

// Test playing different suit when leading suit is available
QUnit.test('isCardLegalToPlay() returns false for playing different suit when leading suit is available', function(assert) {
  // Arrange
  const card = new Card('7', 'Hearts');
  const leadingSuit = 'Clubs';
  const spadesBroken = true;
  const handDoesNotHaveLeadingSuit = false;
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, false, 'Playing different suit when leading suit is available is illegal');
});

// Test playing Spades as first card when Spades are not broken
QUnit.test('isCardLegalToPlay() returns false for playing Spades as first card when Spades are not broken', function(assert) {
  // Arrange
  const card = new Card('A', 'Spades');
  const leadingSuit = null; // First card of the trick
  const spadesBroken = false;
  const handDoesNotHaveLeadingSuit = true; // Doesn't matter for first card
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, false, 'Playing Spades as the first card when Spades are not broken is illegal');
});

// Test playing Spades as first card when Spades are broken
QUnit.test('isCardLegalToPlay() returns true for playing Spades as first card when Spades are broken', function(assert) {
  // Arrange
  const card = new Card('A', 'Spades');
  const leadingSuit = null; // First card of the trick
  const spadesBroken = true;
  const handDoesNotHaveLeadingSuit = true; // Doesn't matter for first card
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, true, 'Playing Spades as the first card when Spades are broken is legal');
});

// Test playing non-Spades as first card
QUnit.test('isCardLegalToPlay() returns true for playing non-Spades as first card', function(assert) {
  // Arrange
  const card = new Card('A', 'Hearts');
  const leadingSuit = null; // First card of the trick
  const spadesBroken = false;
  const handDoesNotHaveLeadingSuit = true; // Doesn't matter for first card
  
  // Act
  const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);
  
  // Assert
  assert.strictEqual(result, true, 'Playing non-Spades as the first card is always legal');
});

// Test playing Jokers
QUnit.test('isCardLegalToPlay() handles Jokers correctly', function(assert) {
  // Arrange
  const bigJoker = new Card('BigJoker', 'Spades');
  const extraJoker = new Card('ExtraJoker', 'Spades');
  const leadingSuit = 'Hearts';
  const spadesBroken = false;
  const handDoesNotHaveLeadingSuit = true;
  
  // Act & Assert
  // Jokers should be playable when player has no cards of the leading suit
  assert.strictEqual(
    LegalPlayRules.isCardLegalToPlay(bigJoker, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit),
    true,
    'BigJoker can be played when player has no cards of the leading suit'
  );
  
  assert.strictEqual(
    LegalPlayRules.isCardLegalToPlay(extraJoker, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit),
    true,
    'ExtraJoker can be played when player has no cards of the leading suit'
  );
  
  // Jokers should not be playable when player has cards of the leading suit
  assert.strictEqual(
    LegalPlayRules.isCardLegalToPlay(bigJoker, leadingSuit, spadesBroken, false),
    false,
    'BigJoker cannot be played when player has cards of the leading suit'
  );
  
  assert.strictEqual(
    LegalPlayRules.isCardLegalToPlay(extraJoker, leadingSuit, spadesBroken, false),
    false,
    'ExtraJoker cannot be played when player has cards of the leading suit'
  );
});

// Test edge cases
QUnit.test('isCardLegalToPlay() handles edge cases correctly', function(assert) {
  // Test with null leadingSuit (first card of trick)
  const card = new Card('A', 'Hearts');
  assert.strictEqual(
    LegalPlayRules.isCardLegalToPlay(card, null, true, true),
    true,
    'Playing any non-Spades card as first card is legal'
  );
  
  // Test with spades broken and leading with spades
  const spadeCard = new Card('K', 'Spades');
  assert.strictEqual(
    LegalPlayRules.isCardLegalToPlay(spadeCard, 'Spades', true, false),
    true,
    'Playing Spades when Spades is the leading suit is legal'
  );
});
