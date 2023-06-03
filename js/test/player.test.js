import { test, assert, setTestFile } from "./testUtils.js";
import { Player } from "../player.js";

export function playerTest() {
  // Run the tests and log the results
  setTestFile('player.test.js');

  test('Player constructor should throw an error if a strategy is provided for the human player', () => {
    // Assert that an error is thrown when a strategy is provided for the human player
    assert(() => new Player('You', false, 'strategy'), 'A strategy must not be provided for the human player');
  });

  test('Player constructor should not throw an error if a strategy is provided for a computer player', () => {
    // Assert that no error is thrown when a strategy is provided for a computer player
    assert(() => new Player('Computer', true, 'strategy'), 'No error should be thrown');
  });
}
