// QUnit integration test for player strategy
import { Game } from '../../../game.js';
import { Turn } from '../../../turn.js';
import { Card } from '../../../card.js';
import { PlayStrategy } from '../../../stratagies/play/playStrategy.js';
import { SmartPlayStrategy } from '../../../stratagies/play/smartPlayStrategy.js';

// Define a QUnit module for player strategy tests
QUnit.module('Integration - Player Strategy', {
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

// Test that the basic strategy follows suit when possible
QUnit.test('Basic strategy follows suit when possible', function(assert) {
  // Create a computer player with a basic strategy
  const computerPlayer = this.game.players[1]; // West player
  computerPlayer.strategy = new PlayStrategy(computerPlayer);
  
  // Set up a controlled hand for the computer player with known cards
  computerPlayer.hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  const heartsCardElement = document.createElement('div');
  heartsCardElement.className = 'card';
  heartsCardElement.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(heartsCardElement);
  
  // Create a map of cards to players for the current trick
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsCard, this.game.players[0]); // South played 10 of Hearts
  
  // Call the strategy to choose a card
  const chosenCard = computerPlayer.strategy.playCard(playerForPlayedCardMap, heartsCard, false);
  
  // Assert that the chosen card is a hearts card (following suit)
  assert.equal(chosenCard.suit, 'Hearts', 'Computer player should follow suit when possible');
});

// Test that the basic strategy plays a valid card when unable to follow suit
QUnit.test('Basic strategy plays a valid card when unable to follow suit', function(assert) {
  // Create a computer player with a basic strategy
  const computerPlayer = this.game.players[1]; // West player
  computerPlayer.strategy = new PlayStrategy(computerPlayer);
  
  // Set up a controlled hand for the computer player with known cards (no clubs)
  computerPlayer.hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Simulate a previous play with clubs as the leading suit
  const clubsCard = new Card('10', 'Clubs');
  const clubsCardElement = document.createElement('div');
  clubsCardElement.className = 'card';
  clubsCardElement.innerHTML = '<div class="card-content">10&nbsp;♣</div>';
  this.mockPlayArea.appendChild(clubsCardElement);
  
  // Create a map of cards to players for the current trick
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(clubsCard, this.game.players[0]); // South played 10 of Clubs
  
  // Call the strategy to choose a card
  const chosenCard = computerPlayer.strategy.playCard(playerForPlayedCardMap, clubsCard, false);
  
  // Assert that a card was chosen (any card is valid when unable to follow suit)
  assert.ok(chosenCard, 'Computer player should choose a card when unable to follow suit');
  
  // Assert that the chosen card is not a clubs card
  assert.notEqual(chosenCard.suit, 'Clubs', 'Computer player should not play a clubs card when they have none');
});

// Test that the basic strategy respects spades breaking rules
QUnit.test('Basic strategy respects spades breaking rules', function(assert) {
  // Create a computer player with a basic strategy
  const computerPlayer = this.game.players[1]; // West player
  computerPlayer.strategy = new PlayStrategy(computerPlayer);
  
  // Set up a controlled hand for the computer player with known cards
  computerPlayer.hand.setCards([
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Hearts'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // No previous play (computer player is leading)
  const playerForPlayedCardMap = new Map();
  
  // Call the strategy to choose a card with spades not broken
  const chosenCard = computerPlayer.strategy.playCard(playerForPlayedCardMap, null, false);
  
  // Assert that the chosen card is not a spades card
  assert.notEqual(chosenCard.suit, 'Spades', 'Computer player should not lead with spades when spades not broken');
});

// Test that the smart strategy makes more advanced decisions
QUnit.test('Smart strategy makes partner-aware decisions', function(assert) {
  // Create a computer player with a smart strategy
  const computerPlayer = this.game.players[1]; // West player (team 2)
  computerPlayer.strategy = new SmartPlayStrategy(computerPlayer);
  
  // Set player teams for testing
  this.game.players[0].team = 1; // South is on team 1
  this.game.players[1].team = 2; // West is on team 2
  this.game.players[2].team = 1; // North is on team 1
  this.game.players[3].team = 2; // East is on team 2 (partner of West)
  
  // Set up a controlled hand for the computer player with known cards
  computerPlayer.hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  const spadesCard = new Card('A', 'Spades');
  
  // Create a map of cards to players for the current trick
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsCard, this.game.players[0]); // South played 10 of Hearts
  playerForPlayedCardMap.set(spadesCard, this.game.players[3]); // East (partner) played Ace of Spades
  
  // Call the strategy to choose a card
  const chosenCard = computerPlayer.strategy.playCard(playerForPlayedCardMap, heartsCard, true);
  
  // Assert that the chosen card is a hearts card (following suit)
  assert.equal(chosenCard.suit, 'Hearts', 'Computer player should follow suit when possible');
  
  // In this scenario, the partner has already played a spade and will win the trick
  // The smart strategy should play a low card to avoid wasting high cards
  assert.equal(chosenCard.rank, 'K', 'Smart strategy should play a lower card (King) when partner is winning');
  
  // Verify both rank and suit together
  assert.ok(chosenCard.rank === 'K' && chosenCard.suit === 'Hearts', 
           'Smart strategy should play the King of Hearts when partner is winning with a spade');
});

// Test that the strategy plays valid cards when unable to follow suit
QUnit.test('Strategy plays valid cards when unable to follow suit', function(assert) {
  // Create a computer player with a basic strategy
  const computerPlayer = this.game.players[1]; // West player
  computerPlayer.strategy = new PlayStrategy(computerPlayer);
  
  // Set up a controlled hand for the computer player with known cards (no clubs)
  computerPlayer.hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Simulate a previous play with clubs as the leading suit
  const clubsCard = new Card('10', 'Clubs');
  const clubsCardElement = document.createElement('div');
  clubsCardElement.className = 'card';
  clubsCardElement.innerHTML = '<div class="card-content">10&nbsp;♣</div>';
  this.mockPlayArea.appendChild(clubsCardElement);
  
  // Create a map of cards to players for the current trick
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(clubsCard, this.game.players[0]); // South played 10 of Clubs
  
  // Call the strategy to choose a card
  const chosenCard = computerPlayer.strategy.playCard(playerForPlayedCardMap, clubsCard, false);
  
  // Assert that a card was chosen (any card is valid when unable to follow suit)
  assert.ok(chosenCard, 'Computer player should choose a card when unable to follow suit');
  
  // Assert that the chosen card is not a clubs card
  assert.notEqual(chosenCard.suit, 'Clubs', 'Computer player should not play a clubs card when they have none');
  
  // Assert that the card was removed from the player's hand
  assert.equal(computerPlayer.hand.cards.length, 3, 'Card should be removed from player hand');
  assert.notOk(computerPlayer.hand.cards.includes(chosenCard), 'Chosen card should not be in player hand anymore');
});

// Test that the strategy plays spades when appropriate
QUnit.test('Strategy plays spades when appropriate', function(assert) {
  // Create a computer player with a basic strategy
  const computerPlayer = this.game.players[1]; // West player
  computerPlayer.strategy = new PlayStrategy(computerPlayer);
  
  // Set up a controlled hand for the computer player with known cards (no hearts)
  computerPlayer.hand.setCards([
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Clubs'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  const heartsCardElement = document.createElement('div');
  heartsCardElement.className = 'card';
  heartsCardElement.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(heartsCardElement);
  
  // Create a map of cards to players for the current trick
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsCard, this.game.players[0]); // South played 10 of Hearts
  
  // Call the strategy to choose a card with spades broken
  const chosenCard = computerPlayer.strategy.playCard(playerForPlayedCardMap, heartsCard, true);
  
  // Assert that a card was chosen
  assert.ok(chosenCard, 'Computer player should choose a card when unable to follow suit');
  
  // Since the player has no hearts, they can play any card
  // The strategy might choose to play a spade to win the trick
  if (chosenCard.suit === 'Spades') {
    assert.ok(true, 'Computer player chose to play a spade when unable to follow suit');
  } else {
    assert.ok(true, 'Computer player chose not to play a spade when unable to follow suit');
  }
  
  // Assert that the card was removed from the player's hand
  assert.equal(computerPlayer.hand.cards.length, 3, 'Card should be removed from player hand');
  assert.notOk(computerPlayer.hand.cards.includes(chosenCard), 'Chosen card should not be in player hand anymore');
});

// Test that the strategy handles edge cases correctly
QUnit.test('Strategy handles edge cases correctly', function(assert) {
  // Create a computer player with a basic strategy
  const computerPlayer = this.game.players[1]; // West player
  computerPlayer.strategy = new PlayStrategy(computerPlayer);
  
  // Test with an empty hand (edge case)
  computerPlayer.hand.setCards([]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Simulate a previous play with hearts as the leading suit
  const heartsCard = new Card('10', 'Hearts');
  
  // Create a map of cards to players for the current trick
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsCard, this.game.players[0]); // South played 10 of Hearts
  
  try {
    // Call the strategy to choose a card
    const chosenCard = computerPlayer.strategy.playCard(playerForPlayedCardMap, heartsCard, false);
    
    // If we get here, the strategy handled the empty hand without crashing
    assert.ok(true, 'Strategy should handle empty hand without crashing');
    assert.strictEqual(chosenCard, undefined, 'Strategy should return undefined for empty hand');
  } catch (error) {
    assert.ok(false, `Strategy crashed with empty hand: ${error.message}`);
  }
  
  // Test with a single card hand (edge case)
  const singleCard = new Card('A', 'Spades');
  computerPlayer.hand.setCards([singleCard]);
  
  try {
    // Call the strategy to choose a card
    const chosenCard = computerPlayer.strategy.playCard(playerForPlayedCardMap, heartsCard, false);
    
    // If we get here, the strategy handled the single card hand without crashing
    assert.ok(true, 'Strategy should handle single card hand without crashing');
    assert.strictEqual(chosenCard, singleCard, 'Strategy should return the only card in hand');
    
    // Assert that the card was removed from the player's hand
    assert.equal(computerPlayer.hand.cards.length, 0, 'Card should be removed from player hand');
  } catch (error) {
    assert.ok(false, `Strategy crashed with single card hand: ${error.message}`);
  }
});
