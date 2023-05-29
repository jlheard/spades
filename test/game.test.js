// game.test.js

import { Game } from '../js/game.js';
import { Player } from '../js/player.js';
import { test, assert, setTestFile } from './testUtils.js';

export function gameTest() {
  setTestFile("game.test.js")

  let game = new Game();

  test('Setting the partner should establish the proper partnerships', () => {
    const you = new Player('You');
    const north = new Player('North');
    const east = new Player('East');
    const west = new Player('West');

    you.setPartner(north);
    north.setPartner(you);
    east.setPartner(west);
    west.setPartner(east);

    assert(you.partner === north, 'You should be partnered with North');
    assert(north.partner === you, 'North should be partnered with You');
    assert(east.partner === west, 'East should be partnered with West');
    assert(west.partner === east, 'West should be partnered with East');
  });

  test('Each player should have 13 cards after dealing hands', () => {
    game.dealHands(game.players); // Pass the players array to dealHands method

    for (const player of game.players) {
      assert(player.hand.length === 13, `${player.name} should have 13 cards`);
    }
  });
}