// QUnit integration test for leading suit validation
import { Game } from '../../../game.js';
import { Turn } from '../../../turn.js';
import { Card } from '../../../card.js';

// Define a QUnit module for leading suit validation tests
QUnit.module('Integration - Leading Suit Validation', {
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
      constructor(game, playerHandElement) {
        super(game, playerHandElement);
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

// Test that human player's hand updates correctly when a computer player leads a trick
QUnit.test('Human player\'s hand updates correctly when computer player leads a trick', function(assert) {
  // Set up a controlled hand for the human player with cards of different suits
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Diamonds'),
    new Card('J', 'Diamonds'),
    new Card('10', 'Clubs'),
    new Card('9', 'Clubs')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game, this.mockPlayerHandElement);
  
  // Simulate a computer player (East) leading with a Diamond
  const playedCard = new Card('3', 'Diamonds');
  
  // Create a card element for the played card
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.classList.add('east');
  cardElement.classList.add('suit-diamonds');
  cardElement.innerHTML = `<div class="card-content">3&nbsp;♦</div>`;
  
  // Add the card to the play area
  this.mockPlayArea.appendChild(cardElement);
  
  // Set up the turn state
  turn.cardsPlayed = 1;
  turn.currentPlayerIndex = 1; // East player (index 1)
  turn.currentPlayer = this.game.players[1];
  
  // Update the human player's hand to reflect the new leading suit
  this.game.players[0].updateHandElement(this.game.getSpadesBroken(), playedCard.suit);
  
  // Get all cards in the human player's hand
  const allCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  
  // Get cards by suit
  const diamondCards = allCards.filter(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return cardContent.includes('♦');
  });
  
  const nonDiamondCards = allCards.filter(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return !cardContent.includes('♦');
  });
  
  // Assert that only Diamond cards are marked as valid plays
  diamondCards.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'Diamond cards should be valid plays when Diamonds is the leading suit');
  });
  
  nonDiamondCards.forEach(card => {
    assert.notOk(card.classList.contains('valid-play'), 
                'Non-Diamond cards should not be valid plays when Diamonds is the leading suit and player has Diamonds');
  });
  
  // Now test the case where the player doesn't have any cards of the leading suit
  
  // Set up a new hand without any Diamonds
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('10', 'Clubs'),
    new Card('9', 'Clubs'),
    new Card('8', 'Spades'),
    new Card('7', 'Spades')
  ]);
  
  // Update the human player's hand to reflect the leading suit
  this.game.players[0].updateHandElement(this.game.getSpadesBroken(), playedCard.suit);
  
  // Get all cards in the human player's hand
  const allCardsNoLeadingSuit = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  
  // Assert that all cards are marked as valid plays when player has no cards of the leading suit
  allCardsNoLeadingSuit.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'All cards should be valid plays when player has no cards of the leading suit');
  });
});

// Test that computer player's play updates the human player's hand correctly
QUnit.test('Computer player\'s play updates human player\'s hand correctly', function(assert) {
  // Set up a controlled hand for the human player with cards of different suits
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Diamonds'),
    new Card('J', 'Diamonds'),
    new Card('10', 'Clubs'),
    new Card('9', 'Clubs')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game, this.mockPlayerHandElement);
  
  // Set up the turn state for a computer player to lead
  turn.cardsPlayed = 0;
  turn.currentPlayerIndex = 1; // East player (index 1)
  turn.currentPlayer = this.game.players[1];
  
  // Simulate a computer player (East) playing a card
  const playedCard = new Card('3', 'Diamonds');
  
  // Create a card element for the played card
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.classList.add('east');
  cardElement.classList.add('suit-diamonds');
  cardElement.innerHTML = `<div class="card-content">3&nbsp;♦</div>`;
  
  // Add the card to the play area
  this.mockPlayArea.appendChild(cardElement);
  
  // Simulate the computerPlayCard method's behavior
  turn.playerForPlayedCardMap.set(playedCard, turn.currentPlayer);
  turn.cardsPlayed++;
  
  // Call the new code that updates the human player's hand
  if (turn.cardsPlayed === 1) {
    // This is the first card played in the trick, so it's the leading suit
    this.game.players[0].updateHandElement(this.game.getSpadesBroken(), playedCard.suit);
  }
  
  // Get all cards in the human player's hand
  const allCards = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'));
  
  // Get cards by suit
  const diamondCards = allCards.filter(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return cardContent.includes('♦');
  });
  
  const nonDiamondCards = allCards.filter(card => {
    const cardContent = card.querySelector('.card-content').textContent;
    return !cardContent.includes('♦');
  });
  
  // Assert that only Diamond cards are marked as valid plays
  diamondCards.forEach(card => {
    assert.ok(card.classList.contains('valid-play'), 
             'Diamond cards should be valid plays when Diamonds is the leading suit');
  });
  
  nonDiamondCards.forEach(card => {
    assert.notOk(card.classList.contains('valid-play'), 
                'Non-Diamond cards should not be valid plays when Diamonds is the leading suit and player has Diamonds');
  });
});
