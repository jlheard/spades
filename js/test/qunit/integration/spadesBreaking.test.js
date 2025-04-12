// QUnit integration test for spades breaking rule
import { Game } from '../../../game.js';
import { Turn } from '../../../turn.js';
import { Card } from '../../../card.js';

// Define a QUnit module for spades breaking rule tests
QUnit.module('Integration - Spades Breaking Rule', {
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

// Test that spades cannot be led until broken
QUnit.test('Spades cannot be led until broken', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Hearts'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance with spades not broken
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.spadesBroken = false;
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardsPlayed = 0; // First card to be played (leading)
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get the spades cards
  const spadesCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♠');
    });
  
  // Assert that spades cards are not marked as valid plays
  spadesCards.forEach(card => {
    assert.notOk(card.classList.contains('valid-play'), 
                'Spades should not be valid plays when leading and spades not broken');
  });
  
  // Get the non-spades cards
  const nonSpadesCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return !cardContent.includes('♠');
    });
  
  // Assert that non-spades cards are marked as valid plays
  nonSpadesCards.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'Non-spades should be valid plays when leading');
  });
  
  // Simulate clicking a spades card
  const spadesCard = spadesCards[0];
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the spades card
  Object.defineProperty(clickEvent, 'target', { value: spadesCard });
  turn.handleCardClick(clickEvent);
  
  // Assert that the spades card was not selected
  assert.strictEqual(turn.selectedCard, null, 'Spades card should not be selectable when spades not broken');
});

// Test that spades are properly broken when played off-suit
QUnit.test('Spades are properly broken when played off-suit', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Hearts'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance with spades not broken
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.spadesBroken = false;
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  
  // Simulate a previous play with clubs as the leading suit
  const clubsCard = new Card('10', 'Clubs');
  const clubsCardElement = document.createElement('div');
  clubsCardElement.className = 'card';
  clubsCardElement.innerHTML = '<div class="card-content">10&nbsp;♣</div>';
  this.mockPlayArea.appendChild(clubsCardElement);
  
  // Set cardsPlayed to 1 to indicate this is not the lead card
  turn.cardsPlayed = 1;
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Clubs');
  
  // Since the player has no clubs, all cards should be valid plays
  const allCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  allCards.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'All cards should be valid plays when player cannot follow suit');
  });
  
  // Get a spades card
  const spadesCard = allCards.find(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return cardContent.includes('♠');
  });
  
  // Simulate clicking and playing the spades card
  const clickEvent1 = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the spades card to select it
  Object.defineProperty(clickEvent1, 'target', { value: spadesCard });
  turn.handleCardClick(clickEvent1);
  
  // Assert that the spades card was selected
  assert.strictEqual(turn.selectedCard, spadesCard, 'Spades card should be selectable when following suit and player has no clubs');
  
  // Simulate clicking the spades card again to play it
  const clickEvent2 = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the spades card again to play it
  Object.defineProperty(clickEvent2, 'target', { value: spadesCard });
  turn.handleCardClick(clickEvent2);
  
  // Assert that spades are now broken
  assert.ok(turn.spadesBroken, 'Spades should be broken after playing a spade off-suit');
});

// Test that spades can be led after being broken
QUnit.test('Spades can be led after being broken', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Hearts'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance with spades broken
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.spadesBroken = true; // Spades are already broken
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardsPlayed = 0; // First card to be played (leading)
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get the spades cards
  const spadesCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .filter(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♠');
    });
  
  // Assert that spades cards are marked as valid plays
  spadesCards.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'Spades should be valid plays when leading and spades broken');
  });
  
  // Simulate clicking a spades card
  const spadesCard = spadesCards[0];
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the spades card
  Object.defineProperty(clickEvent, 'target', { value: spadesCard });
  turn.handleCardClick(clickEvent);
  
  // Assert that the spades card was selected
  assert.strictEqual(turn.selectedCard, spadesCard, 'Spades card should be selectable when spades broken');
});

// Test UI correctly shows valid/invalid plays based on spades status
QUnit.test('UI correctly shows valid/invalid plays based on spades status', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Hearts'),
    new Card('J', 'Diamonds')
  ]);
  
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
  
  // Get spades and non-spades cards
  const spadesCards = allCards.filter(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return cardContent.includes('♠');
  });
  
  const nonSpadesCards = allCards.filter(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return !cardContent.includes('♠');
  });
  
  // Assert that spades cards are not marked as valid plays when leading and spades not broken
  spadesCards.forEach(card => {
    assert.notOk(card.classList.contains('valid-play'), 
                'Spades should not be valid plays when leading and spades not broken');
  });
  
  // Assert that non-spades cards are marked as valid plays
  nonSpadesCards.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'Non-spades should be valid plays when leading');
  });
  
  // Now break spades and test again
  turn.spadesBroken = true;
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get all cards again (they've been recreated)
  const allCardsAfterBreaking = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  
  // Assert that all cards are marked as valid plays when spades broken
  allCardsAfterBreaking.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'All cards should be valid plays when leading and spades broken');
  });
  
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
  
  // Get hearts and non-hearts cards
  const heartsCards = allCardsFollowingSuit.filter(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return cardContent.includes('♥');
  });
  
  const nonHeartsCards = allCardsFollowingSuit.filter(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return !cardContent.includes('♥');
  });
  
  // Assert that hearts cards are marked as valid plays
  heartsCards.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'Hearts should be valid plays when following hearts');
  });
  
  // Assert that non-hearts cards are not marked as valid plays
  nonHeartsCards.forEach(card => {
    assert.notOk(card.classList.contains('valid-play'), 
                'Non-hearts should not be valid plays when following hearts and player has hearts');
  });
});
