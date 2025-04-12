// QUnit integration test for unusual card distributions
import { Game } from '../../../game.js';
import { Turn } from '../../../turn.js';
import { Card } from '../../../card.js';
import { Hand } from '../../../hand.js';
import { LegalPlayRules } from '../../../legalPlayRules.js';

// Define a QUnit module for unusual card distribution tests
QUnit.module('Integration - Unusual Card Distributions', {
  beforeEach: function() {
    // Set up the DOM elements needed for testing
    this.fixture = document.getElementById('qunit-fixture');
    
    // Create a mock player hand element
    this.mockPlayerHandElement = document.createElement('div');
    this.mockPlayerHandElement.id = 'player-hand';
    this.fixture.appendChild(this.mockPlayerHandElement);
    
    // Create a mock play area
    this.mockPlayArea = document.createElement('div');
    this.mockPlayArea.className = 'play-area';
    this.fixture.appendChild(this.mockPlayArea);
    
    // Create a new game
    this.game = new Game();
    
    // Create a custom Turn class for testing that doesn't auto-play computer cards
    this.TestTurn = class extends Turn {
      constructor(players, playerHandElement) {
        super(players, playerHandElement);
        // Reset cardsPlayed to 0 since the constructor might have triggered computer plays
        this.cardsPlayed = 0;
      }
      
      // Override playCard to do nothing in tests
      playCard() {
        // No-op for testing
      }
      
      // Override nextComputerTurn to do nothing in tests
      nextComputerTurn() {
        // No-op for testing
      }
    };
  }
});

// Test when a player has all cards of one suit
QUnit.test('Player with all cards of one suit', function(assert) {
  // Set up a controlled hand for the human player with all spades
  const allSpadesHand = [
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Spades'),
    new Card('J', 'Spades'),
    new Card('10', 'Spades'),
    new Card('9', 'Spades'),
    new Card('8', 'Spades'),
    new Card('7', 'Spades'),
    new Card('6', 'Spades'),
    new Card('5', 'Spades'),
    new Card('4', 'Spades'),
    new Card('3', 'Spades'),
    new Card('2', 'Spades')
  ];
  
  this.game.players[0].hand.setCards(allSpadesHand);
  
  // Create a turn instance with spades not broken
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.spadesBroken = false;
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  
  // Test leading (cardsPlayed = 0)
  turn.cardsPlayed = 0;
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get all cards
  const allCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  
  // Assert that no cards are marked as valid plays when leading and spades not broken
  let anyValidPlays = false;
  allCards.forEach(card => {
    if (card.classList.contains('valid-play')) {
      anyValidPlays = true;
    }
  });
  
  assert.notOk(anyValidPlays, 'No cards should be valid plays when player has only spades and spades not broken');
  
  // Now break spades and test again
  turn.spadesBroken = true;
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get all cards again (they've been recreated)
  const allCardsAfterBreaking = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  
  // Assert that all cards are marked as valid plays when spades broken
  let allValidPlays = true;
  allCardsAfterBreaking.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allValidPlays = false;
    }
  });
  
  assert.ok(allValidPlays, 'All cards should be valid plays when player has only spades and spades broken');
  
  // Now test following suit
  turn.cardsPlayed = 1;
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  const heartsCardElement = document.createElement('div');
  heartsCardElement.className = 'card';
  heartsCardElement.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(heartsCardElement);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Hearts');
  
  // Get all cards again (they've been recreated)
  const allCardsFollowingSuit = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  
  // Assert that all cards are marked as valid plays when player has no cards of the leading suit
  let allValidPlaysFollowing = true;
  allCardsFollowingSuit.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allValidPlaysFollowing = false;
    }
  });
  
  assert.ok(allValidPlaysFollowing, 'All cards should be valid plays when player has no cards of the leading suit');
});

// Test when a player has no cards of a particular suit
QUnit.test('Player with no cards of a particular suit', function(assert) {
  // Set up a controlled hand for the human player with no hearts
  const noHeartsHand = [
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Spades'),
    new Card('J', 'Spades'),
    new Card('A', 'Diamonds'),
    new Card('K', 'Diamonds'),
    new Card('Q', 'Diamonds'),
    new Card('J', 'Diamonds'),
    new Card('A', 'Clubs'),
    new Card('K', 'Clubs'),
    new Card('Q', 'Clubs'),
    new Card('J', 'Clubs'),
    new Card('10', 'Clubs')
  ];
  
  this.game.players[0].hand.setCards(noHeartsHand);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardsPlayed = 1; // Not leading
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  const heartsCardElement = document.createElement('div');
  heartsCardElement.className = 'card';
  heartsCardElement.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(heartsCardElement);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Hearts');
  
  // Get all cards
  const allCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  
  // Assert that all cards are marked as valid plays when player has no cards of the leading suit
  let allValidPlays = true;
  allCards.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allValidPlays = false;
    }
  });
  
  assert.ok(allValidPlays, 'All cards should be valid plays when player has no cards of the leading suit');
  
  // Test that spades can be played even if spades are not broken
  turn.spadesBroken = false;
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Hearts');
  
  // Get all spades cards
  const spadesCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♠');
    });
  
  // Assert that spades cards are marked as valid plays when player has no cards of the leading suit
  let allSpadesValid = true;
  spadesCards.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allSpadesValid = false;
    }
  });
  
  assert.ok(allSpadesValid, 'Spades should be valid plays when player has no cards of the leading suit, even if spades not broken');
});

// Test when a player has mostly high cards
QUnit.test('Player with mostly high cards', function(assert) {
  // Set up a controlled hand for the human player with mostly high cards
  const highCardsHand = [
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Spades'),
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Hearts'),
    new Card('A', 'Diamonds'),
    new Card('K', 'Diamonds'),
    new Card('Q', 'Diamonds'),
    new Card('A', 'Clubs'),
    new Card('K', 'Clubs'),
    new Card('Q', 'Clubs'),
    new Card('J', 'Clubs')
  ];
  
  this.game.players[0].hand.setCards(highCardsHand);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  
  // Test leading (cardsPlayed = 0)
  turn.cardsPlayed = 0;
  turn.spadesBroken = false;
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get all non-spades cards
  const nonSpadesCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return !cardContent.includes('♠');
    });
  
  // Assert that all non-spades cards are marked as valid plays when leading
  let allNonSpadesValid = true;
  nonSpadesCards.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allNonSpadesValid = false;
    }
  });
  
  assert.ok(allNonSpadesValid, 'All non-spades cards should be valid plays when leading and spades not broken');
  
  // Now test following suit
  turn.cardsPlayed = 1;
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  const heartsCardElement = document.createElement('div');
  heartsCardElement.className = 'card';
  heartsCardElement.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(heartsCardElement);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Hearts');
  
  // Get hearts cards
  const heartsCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♥');
    });
  
  // Assert that hearts cards are marked as valid plays
  let allHeartsValid = true;
  heartsCards.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allHeartsValid = false;
    }
  });
  
  assert.ok(allHeartsValid, 'Hearts cards should be valid plays when hearts is the leading suit');
  
  // Get non-hearts cards
  const nonHeartsCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return !cardContent.includes('♥');
    });
  
  // Assert that non-hearts cards are not marked as valid plays
  let anyNonHeartsValid = false;
  nonHeartsCards.forEach(card => {
    if (card.classList.contains('valid-play')) {
      anyNonHeartsValid = true;
    }
  });
  
  assert.notOk(anyNonHeartsValid, 'Non-hearts cards should not be valid plays when hearts is the leading suit and player has hearts');
});

// Test when a player has mostly low cards
QUnit.test('Player with mostly low cards', function(assert) {
  // Set up a controlled hand for the human player with mostly low cards
  const lowCardsHand = [
    new Card('2', 'Spades'),
    new Card('3', 'Spades'),
    new Card('4', 'Spades'),
    new Card('2', 'Hearts'),
    new Card('3', 'Hearts'),
    new Card('4', 'Hearts'),
    new Card('2', 'Diamonds'),
    new Card('3', 'Diamonds'),
    new Card('4', 'Diamonds'),
    new Card('2', 'Clubs'),
    new Card('3', 'Clubs'),
    new Card('4', 'Clubs'),
    new Card('5', 'Clubs')
  ];
  
  this.game.players[0].hand.setCards(lowCardsHand);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  
  // Test leading (cardsPlayed = 0)
  turn.cardsPlayed = 0;
  turn.spadesBroken = false;
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get all non-spades cards
  const nonSpadesCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return !cardContent.includes('♠');
    });
  
  // Assert that all non-spades cards are marked as valid plays when leading
  let allNonSpadesValid = true;
  nonSpadesCards.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allNonSpadesValid = false;
    }
  });
  
  assert.ok(allNonSpadesValid, 'All non-spades cards should be valid plays when leading and spades not broken');
  
  // Now test following suit
  turn.cardsPlayed = 1;
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  const heartsCardElement = document.createElement('div');
  heartsCardElement.className = 'card';
  heartsCardElement.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(heartsCardElement);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Hearts');
  
  // Get hearts cards
  const heartsCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♥');
    });
  
  // Assert that hearts cards are marked as valid plays
  let allHeartsValid = true;
  heartsCards.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allHeartsValid = false;
    }
  });
  
  assert.ok(allHeartsValid, 'Hearts cards should be valid plays when hearts is the leading suit');
});

// Test with jokers in the hand
QUnit.test('Player with jokers in hand', function(assert) {
  // Set up a controlled hand for the human player with jokers
  const jokersHand = [
    new Card('BigJoker', 'Spades'),
    new Card('ExtraJoker', 'Spades'),
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('A', 'Diamonds'),
    new Card('K', 'Diamonds'),
    new Card('A', 'Clubs'),
    new Card('K', 'Clubs'),
    new Card('Q', 'Clubs'),
    new Card('J', 'Clubs'),
    new Card('10', 'Clubs')
  ];
  
  this.game.players[0].hand.setCards(jokersHand);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  
  // Test leading (cardsPlayed = 0)
  turn.cardsPlayed = 0;
  turn.spadesBroken = false;
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get joker cards
  const jokerCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('Joker');
    });
  
  // Assert that jokers are not marked as valid plays when leading
  let anyJokersValid = false;
  jokerCards.forEach(card => {
    if (card.classList.contains('valid-play')) {
      anyJokersValid = true;
    }
  });
  
  assert.notOk(anyJokersValid, 'Jokers should not be valid plays when leading');
  
  // Now test following suit when player has the leading suit
  turn.cardsPlayed = 1;
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  const heartsCardElement = document.createElement('div');
  heartsCardElement.className = 'card';
  heartsCardElement.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(heartsCardElement);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Hearts');
  
  // Get joker cards again
  const jokerCardsFollowing = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('Joker');
    });
  
  // Assert that jokers are not marked as valid plays when player has the leading suit
  let anyJokersValidFollowing = false;
  jokerCardsFollowing.forEach(card => {
    if (card.classList.contains('valid-play')) {
      anyJokersValidFollowing = true;
    }
  });
  
  assert.notOk(anyJokersValidFollowing, 'Jokers should not be valid plays when player has the leading suit');
  
  // Now test following suit when player does not have the leading suit
  // Set up a new hand with no hearts
  const noHeartsHand = [
    new Card('BigJoker', 'Spades'),
    new Card('ExtraJoker', 'Spades'),
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('A', 'Diamonds'),
    new Card('K', 'Diamonds'),
    new Card('A', 'Clubs'),
    new Card('K', 'Clubs'),
    new Card('Q', 'Clubs'),
    new Card('J', 'Clubs'),
    new Card('10', 'Clubs'),
    new Card('9', 'Clubs'),
    new Card('8', 'Clubs')
  ];
  
  this.game.players[0].hand.setCards(noHeartsHand);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Hearts');
  
  // Get joker cards again
  const jokerCardsNoHearts = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('Joker');
    });
  
  // Assert that jokers are marked as valid plays when player does not have the leading suit
  let allJokersValid = true;
  jokerCardsNoHearts.forEach(card => {
    if (!card.classList.contains('valid-play')) {
      allJokersValid = false;
    }
  });
  
  assert.ok(allJokersValid, 'Jokers should be valid plays when player does not have the leading suit');
});
