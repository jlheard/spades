// QUnit integration test for game initialization
import { Game } from '../../../game.js';
import { Card, RANKS, SUITS } from '../../../card.js';
import { PlayStrategy } from '../../../stratagies/play/playStrategy.js';

// Define a QUnit module for game initialization tests
QUnit.module('Integration - Game Initialization', {
  beforeEach: function() {
    // Set up the DOM elements needed for testing
    this.fixture = document.getElementById('qunit-fixture');
    
    // Create a mock player hand element
    this.mockPlayerHandElement = document.createElement('div');
    this.mockPlayerHandElement.id = 'player-hand';
    this.fixture.appendChild(this.mockPlayerHandElement);
    
    // Create mock book elements
    this.team1BooksElement = document.createElement('div');
    this.team1BooksElement.className = 'team1-books';
    this.team1BooksElement.textContent = 'Our Books: 0 / Bid: 0';
    this.fixture.appendChild(this.team1BooksElement);
    
    this.team2BooksElement = document.createElement('div');
    this.team2BooksElement.className = 'team2-books';
    this.team2BooksElement.textContent = 'Their Books: 0 / Bid: 0';
    this.fixture.appendChild(this.team2BooksElement);
    
    // Create a mock play area
    this.mockPlayArea = document.createElement('div');
    this.mockPlayArea.className = 'play-area';
    this.fixture.appendChild(this.mockPlayArea);
  }
});

// Test game initialization with proper player setup
QUnit.test('Game initializes with correct player setup', function(assert) {
  // Create a new game
  const game = new Game();
  
  // Assert that there are 4 players
  assert.equal(game.players.length, 4, 'Game should have 4 players');
  
  // Assert player names
  assert.equal(game.players[0].name, 'You', 'First player should be named "You"');
  assert.equal(game.players[1].name, 'West', 'Second player should be named "West"');
  assert.equal(game.players[2].name, 'North', 'Third player should be named "North"');
  assert.equal(game.players[3].name, 'East', 'Fourth player should be named "East"');
  
  // Assert player types (human vs computer)
  assert.equal(game.players[0].isComputer, false, 'First player should be human');
  assert.equal(game.players[1].isComputer, true, 'Second player should be computer');
  assert.equal(game.players[2].isComputer, true, 'Third player should be computer');
  assert.equal(game.players[3].isComputer, true, 'Fourth player should be computer');
  
  // Assert player teams
  assert.equal(game.players[0].team, 1, 'First player should be on team 1');
  assert.equal(game.players[1].team, 2, 'Second player should be on team 2');
  assert.equal(game.players[2].team, 1, 'Third player should be on team 1');
  assert.equal(game.players[3].team, 2, 'Fourth player should be on team 2');
  
  // Assert computer players have strategies
  assert.ok(game.players[1].strategy instanceof PlayStrategy, 'Computer player should have a strategy');
  assert.ok(game.players[2].strategy instanceof PlayStrategy, 'Computer player should have a strategy');
  assert.ok(game.players[3].strategy instanceof PlayStrategy, 'Computer player should have a strategy');
});

// Test card dealing
QUnit.test('Game deals correct number of cards to each player', function(assert) {
  // Create a new game
  const game = new Game();
  
  // Assert that each player has 13 cards
  assert.equal(game.players[0].hand.cards.length, 13, 'First player should have 13 cards');
  assert.equal(game.players[1].hand.cards.length, 13, 'Second player should have 13 cards');
  assert.equal(game.players[2].hand.cards.length, 13, 'Third player should have 13 cards');
  assert.equal(game.players[3].hand.cards.length, 13, 'Fourth player should have 13 cards');
  
  // Assert that all cards are valid
  game.players.forEach(player => {
    player.hand.cards.forEach(card => {
      assert.ok(card instanceof Card, 'Each card should be a Card instance');
      assert.ok(SUITS.includes(card.suit), 'Card should have a valid suit');
      assert.ok(RANKS.includes(card.rank), 'Card should have a valid rank');
    });
  });
  
  // Assert that cards are sorted in player hands
  game.players.forEach(player => {
    const sortedHand = [...player.hand.cards].sort((a, b) => {
      const suitOrder = { 'Spades': 0, 'Hearts': 1, 'Diamonds': 2, 'Clubs': 3 };
      const rankOrder = { 
        'BigJoker': -2, 'ExtraJoker': -1, 
        'A': 0, 'K': 1, 'Q': 2, 'J': 3, '10': 4, '9': 5, '8': 6, 
        '7': 7, '6': 8, '5': 9, '4': 10, '3': 11, '2': 12 
      };
      
      if (suitOrder[a.suit] !== suitOrder[b.suit]) {
        return suitOrder[a.suit] - suitOrder[b.suit];
      }
      
      return rankOrder[a.rank] - rankOrder[b.rank];
    });
    
    // Check if the hand is sorted correctly
    let isSorted = true;
    for (let i = 0; i < player.hand.cards.length; i++) {
      if (player.hand.cards[i] !== sortedHand[i]) {
        isSorted = false;
        break;
      }
    }
    
    assert.ok(isSorted, `${player.name}'s hand should be sorted`);
  });
});

// Test initial UI state
QUnit.test('Game initializes UI elements correctly', function(assert) {
  try {
    // Create a new game
    document.body.appendChild(this.mockPlayerHandElement);
    const game = new Game();
    
    // Assert that the player hand element is populated
    const cardElements = this.mockPlayerHandElement.querySelectorAll('.card');
    assert.equal(cardElements.length, 13, 'Player hand should have 13 card elements');
    
    // Assert that each card element has the correct structure
    cardElements.forEach(cardElement => {
      assert.ok(cardElement.classList.contains('card'), 'Element should have card class');
      
      const cardContent = cardElement.querySelector('.card-content');
      assert.ok(cardContent, 'Card should have content element');
      
      // Check if the card content has valid text (rank and suit symbol)
      const contentText = cardContent.textContent;
      assert.ok(contentText.length > 0, 'Card content should have text');
      
      // Check if the card has valid-play class (all cards are valid at the start)
      assert.ok(cardElement.classList.contains('valid-play'), 'Card should be marked as valid play at start');
    });
    
    // Assert that the book elements show initial values
    assert.equal(this.team1BooksElement.textContent, 'Our Books: 0 / Bid: 0', 'Team 1 books should be initialized to 0');
    assert.equal(this.team2BooksElement.textContent, 'Their Books: 0 / Bid: 0', 'Team 2 books should be initialized to 0');
    
    // Assert that the play area is empty
    assert.equal(this.mockPlayArea.children.length, 0, 'Play area should be empty at start');
  } finally {
    // Clean up - ensure this runs even if the test fails
    if (document.body.contains(this.mockPlayerHandElement)) {
      document.body.removeChild(this.mockPlayerHandElement);
    }
  }
});

// Test that no duplicate cards are dealt
QUnit.test('Game deals unique cards to players', function(assert) {
  // Create a new game
  const game = new Game();
  
  // Collect all cards from all players
  const allCards = [];
  game.players.forEach(player => {
    player.hand.cards.forEach(card => {
      allCards.push(`${card.rank} of ${card.suit}`);
    });
  });
  
  // Assert that there are 52 unique cards
  const uniqueCards = new Set(allCards);
  assert.equal(uniqueCards.size, 52, 'All 52 cards should be unique');
  assert.equal(allCards.length, 52, 'Total of 52 cards should be dealt');
});
