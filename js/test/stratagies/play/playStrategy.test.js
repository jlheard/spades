// playStrategy.test.js

import { beforeEach, test, assert, setTestFile } from "../../testUtils.js";
import { PlayStrategy } from "../../../stratagies/play/playStrategy.js";
import { Player } from "../../../player.js";

beforeEach(() => {
    // Setup function to run before each test
});

export function playStrategyTest() {
    // Run the tests and log the results
    setTestFile('playStrategy.test.js');

    test('PlayStrategy should select a valid card to play', () => {
        const player = new Player("Player Name");
        player.setHand([{ rank: 'A', suit: 'Spades' }, { rank: 'K', suit: 'Hearts' }, { rank: 'Q', suit: 'Diamonds' }]);
        player.game = { spadesBroken: true };

        const strategy = new PlayStrategy(player);

        // Call the playCard method
        const playedCard = strategy.playCard(null, true);

        // Assert that a valid card was played
        assert(playedCard !== null, 'A valid card should be played');

        // Assert that the played card was removed from the player's hand
        assert(player.hand.cards.length === 2, 'The played card should be removed from the player\'s hand');
    });

}
