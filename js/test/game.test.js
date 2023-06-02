// game.test.js

import { Game } from '../game.js';
import { Player } from '../player.js';
import { test, assert, setTestFile, beforeEach } from './testUtils.js';

export function gameTest() {
  setTestFile("game.test.js")

  let game;

  beforeEach(() => {
    game = new Game();
  });  

  test('Setting the team should establish the proper teams', () => {
    const you = new Player('You');
    const north = new Player('North');
    const east = new Player('East');
    const west = new Player('West');

    you.setTeam(1);
    north.setTeam(1);
    east.setTeam(2);
    west.setTeam(2);

    assert(you.team === 1, 'You should be on team 1');
    assert(north.team === 1, 'North should be on team 1');
    assert(east.team  === 2, 'East should be on team 2');
    assert(west.team === 2, 'West should be on team 2');
  });

  test('Each player should have 13 cards after dealing hands', () => {
    for (const player of game.players) {
      assert(player.hand.getCards().length === 13, `${player.name} should have 13 cards`);
    }
  });
}
