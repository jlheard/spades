import { beforeEach, test, assert, setTestFile } from "../../testUtils.js";
import { compareCardsForTurn } from "../../../cardComparer.js";
import { Card } from "../../../card.js";
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

        const playerForPlayedCardMap = []; // Array to store the played cards
        const leadingCard = null; // Set the leading card to null for this test
        const spadesBroken = true; // Set spadesBroken to true for this test

        // Call the playCard method
        const playedCard = strategy.playCard(playerForPlayedCardMap, leadingCard, spadesBroken);

        // Assert that a valid card was played
        assert(playedCard !== null, 'A valid card should be played');

        // Assert that the played card was removed from the player's hand
        assert(player.hand.cards.length === 2, 'The played card should be removed from the player\'s hand');
    });

    // Test case: throwLowestRankingCard method
    test('throwLowestRankingCard', () => {
        // Create an instance of PlayStrategy
        const playStrategy = new PlayStrategy(null);

        const validPlays = [
            new Card('2', 'Spades'),
            new Card('5', 'Hearts'),
            new Card('3', 'Diamonds')
        ];

        const chosenCard = playStrategy.throwLowestRankingCard(validPlays);

        assert(
            chosenCard.rank === '2',
            'Expected lowest-ranking card to be chosen'
        );
    });

    // Test case: partnerHasCutAndWillWin method
    test('partnerHasCutAndWillWin', () => {
        let partner = new Player('Partner');
        partner.setTeam(1);

        let smartPlayer = new Player('SmartPlayer')
        partner.setTeam(1);

        // Create an instance of PlayStrategy
        const playStrategy = new PlayStrategy(smartPlayer);

        let opponent1 = new Player('Opponent 1')
        opponent1.setTeam(2);

        let opponent2 = new Player('Opponent 2')
        opponent2.setTeam(2);

        const partnerCard = new Card('A', 'Spades');
        const playerForPlayedCardMap = new Map([
            [new Card('K', 'Hearts'), opponent1],
            [partnerCard, partner],
            [new Card('3', 'Hearts'), opponent2],
        ]);

        const result = playStrategy.partnerHasCutAndWillWin(partnerCard, playerForPlayedCardMap);

        assert(result === true, 'Expected partner to have cut and will win');
    });



    // Test case: throwLowestCardInCutSuit method
    test('throwLowestCardInCutSuit', () => {
        // Create an instance of PlayStrategy
        const playStrategy = new PlayStrategy(null);

        const validPlays = [
            new Card('2', 'Spades'),
            new Card('5', 'Hearts'),
            new Card('3', 'Spades')
        ];
        const partnerCard = new Card('K', 'Spades');

        const chosenCard = playStrategy.throwLowestCardInCutSuit(validPlays, partnerCard);

        assert(
            chosenCard.rank === '2' && chosenCard.suit === 'Spades',
            'Expected lowest-ranked cut suit card to be chosen'
        );
    });

    // Test case: partnerLeadsWithLastOpponent method
    test('partnerLeadsWithLastOpponent', () => {
        // Create an instance of PlayStrategy
        const playStrategy = new PlayStrategy(null);

        const partnerCard = new Card('A', 'Diamonds');
        const playerForPlayedCardMap = new Map();
        playerForPlayedCardMap.set(new Card('J', 'Diamonds'), new Player('1'));
        playerForPlayedCardMap.set(partnerCard, new Player('2'))

        const result = playStrategy.partnerLeadsWithLastOpponent(partnerCard, playerForPlayedCardMap);

        assert(result === true, 'Expected partner to lead with the last opponent');
    });

    // Test case: playHighestCardInLeadSuit method
    test('playHighestCardInLeadSuit', () => {
        // Create an instance of PlayStrategy
        const playStrategy = new PlayStrategy(null);

        const validPlays = [
            new Card('2', 'Spades'),
            new Card('5', 'Hearts'),
            new Card('3', 'Hearts')
        ];
        const leadingCard = new Card('4', 'Hearts');

        const chosenCard = playStrategy.playHighestCardInLeadSuit(validPlays, leadingCard);

        assert(
            chosenCard.rank === '5' && chosenCard.suit === 'Hearts',
            'Expected highest-ranked card in lead suit to be chosen'
        );
    });

    // Test case: playHighestRankingCard method
    test('playHighestRankingCard', () => {
        // Create an instance of PlayStrategy
        const playStrategy = new PlayStrategy(null);

        const validPlays = [
            new Card('2', 'Spades'),
            new Card('5', 'Hearts'),
            new Card('3', 'Diamonds')
        ];

        const chosenCard = playStrategy.playHighestRankingCard(validPlays);

        assert(
            chosenCard.rank === '5',
            'Expected highest-ranking card to be chosen'
        );
    });

    // Test case: getPartnerCard method
    test('getPartnerCard', () => {
        // Create an instance of PlayStrategy
        const playStrategy = new PlayStrategy(null);

        const player1 = new Player('Player 1');
        player1.setTeam(1);
        const player2 = new Player('Player 2');
        player2.setTeam(2);
        const player3 = new Player('Player 3');
        player3.setTeam(1);

        const playerForPlayedCardMap = new Map();
        playerForPlayedCardMap.set(player1, new Card('2', 'Spades'));
        playerForPlayedCardMap.set(player2, new Card('5', 'Hearts'));
        playerForPlayedCardMap.set(player3, new Card('3', 'Diamonds'));

        const partnerCard = playStrategy.getPartnerCard(playerForPlayedCardMap);

        assert(
            partnerCard.rank === '5' && partnerCard.suit === 'Hearts',
            'Expected partner card to be retrieved'
        );
    });


    // Test case: getTeamPlayer method
    test('getTeamPlayer', () => {
        // Create an instance of PlayStrategy
        const playStrategy = new PlayStrategy(null);

        const player1 = new Player('Player 1');
        player1.setTeam(1);
        const player2 = new Player('Player 2');
        player2.setTeam(2);
        const player3 = new Player('Player 3');
        player3.setTeam(1);

        const playerForPlayedCardMap = new Map([
            [player1, new Card('2', 'Spades')],
            [player2, new Card('5', 'Hearts')],
            [player3, new Card('3', 'Diamonds')],
        ]);

        let team = 1;
        const team1Player = playStrategy.getTeamPlayer(playerForPlayedCardMap, team);

        assert(
            team1Player.team === team,
            'Expected team ' + team + ' player to be retrieved'
        );

        team = 2;
        const team2Player = playStrategy.getTeamPlayer(playerForPlayedCardMap, team);

        assert(
            team2Player.team === team,
            'Expected team ' + team + ' player to be retrieved'
        );
    });



    // Test case: Get winning player from played cards map
    test('Get winning player from played cards map', () => {
        const player1 = new Player('Player 1');
        const player2 = new Player('Player 2');
        const player3 = new Player('Player 3');
        const player4 = new Player('Player 4');

        const strategy = new PlayStrategy(player1);

        const card1 = new Card('A', 'Spades');
        const card2 = new Card('Q', 'Spades');
        const card3 = new Card('K', 'Spades');
        const card4 = new Card('J', 'Spades');

        const playerForPlayedCardMap = new Map([
            [card1, player1],
            [card2, player2],
            [card3, player3],
            [card4, player4],
        ]);

        const winningCard = compareCardsForTurn(playerForPlayedCardMap);
        const expectedWinningPlayer = playerForPlayedCardMap.get(winningCard);

        assert(
            strategy.getWinningPlayer(playerForPlayedCardMap) === expectedWinningPlayer,
            'Expected winning player to be determined correctly'
        );
    });
}
