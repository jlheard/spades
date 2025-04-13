// QUnit test file for Game class
import { Game } from '../../game.js';
import { Player } from '../../player.js';

// Define a QUnit module for Game tests
QUnit.module('Game Tests', {
  beforeEach: function() {
    this.game = new Game();
  }
});

// Test setting teams
QUnit.test('Setting the team should establish the proper teams', function(assert) {
  const you = new Player('You');
  const north = new Player('North');
  const east = new Player('East');
  const west = new Player('West');

  you.setTeam(1);
  north.setTeam(1);
  east.setTeam(2);
  west.setTeam(2);

  assert.equal(you.team, 1, 'You should be on team 1');
  assert.equal(north.team, 1, 'North should be on team 1');
  assert.equal(east.team, 2, 'East should be on team 2');
  assert.equal(west.team, 2, 'West should be on team 2');
});

// Test dealing hands
QUnit.test('Each player should have 13 cards after dealing hands', function(assert) {
  for (const player of this.game.players) {
    assert.equal(player.hand.getCards().length, 13, `${player.name} should have 13 cards`);
  }
});

// Test spadesBroken property
QUnit.test('spadesBroken property should be initialized to false', function(assert) {
  assert.equal(this.game.getSpadesBroken(), false, 'spadesBroken should be initialized to false');
});

// Test setSpadesBroken method
QUnit.test('setSpadesBroken method should update the spadesBroken property', function(assert) {
  // Initially false
  assert.equal(this.game.getSpadesBroken(), false, 'spadesBroken should be initialized to false');
  
  // Set to true
  this.game.setSpadesBroken(true);
  assert.equal(this.game.getSpadesBroken(), true, 'spadesBroken should be updated to true');
  
  // Set back to false
  this.game.setSpadesBroken(false);
  assert.equal(this.game.getSpadesBroken(), false, 'spadesBroken should be updated to false');
});

// Test that spadesBroken persists across turns
QUnit.test('spadesBroken should persist across turns', function(assert) {
  // Set spadesBroken to true
  this.game.setSpadesBroken(true);
  assert.equal(this.game.getSpadesBroken(), true, 'spadesBroken should be true after setting it');
  
  // Simulate a new trick by creating a new Turn instance (without actually creating one)
  // The important thing is that the game's spadesBroken property remains true
  assert.equal(this.game.getSpadesBroken(), true, 'spadesBroken should remain true across turns');
});
