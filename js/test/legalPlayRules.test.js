import { LegalPlayRules } from '../legalPlayRules.js';
import { assert, test, beforeEach, setTestFile } from './testUtils.js';

export function legalPlayRulesTest() {
    beforeEach(() => {
        // Set up any necessary test data or configurations
    });

    setTestFile('legalPlayRules.test.js');

    test('LegalPlayRules - isCardLegalToPlay() returns true for playing same suit card', () => {
        // Arrange
        const card = { suit: 'Hearts', rank: 'A' };
        const leadingSuit = 'Hearts';
        const leadingRank = 'A';
        const spadesBroken = true;
        const handDoesNotHaveLeadingSuit = false;
        // Act
        const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);

        // Assert
        assert(result === true, 'Playing same suit card is legal');
    });

    test('LegalPlayRules - isCardLegalToPlay() returns true for playing Spades when Spades are broken and player does not have leading suite', () => {
        // Arrange
        const card = { suit: 'Spades', rank: '5' };
        const leadingSuit = 'Diamonds';
        const spadesBroken = true;
        const handDoesNotHaveLeadingSuit = true;

        // Act
        const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);

        // Assert
        assert(result === true, 'Playing Spades when Spades are broken is legal');
    });

    test('LegalPlayRules - isCardLegalToPlay() returns true for playing Spades when Spades are not broken and player does not have leading suite', () => {
        // Arrange
        const card = { suit: 'Spades', rank: '5' };
        const leadingSuit = 'Diamonds';
        const spadesBroken = false;
        const handDoesNotHaveLeadingSuit = true;

        // Act
        const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);

        // Assert
        assert(result === true, 'Playing Spades when Spades are broken is legal');
    });

    test('LegalPlayRules - isCardLegalToPlay() returns false when player reneges which is playing Spades when Spades are NOT broken and player has the leading suit.', () => {
        // Arrange
        const card = { suit: 'Spades', rank: '5' };
        const leadingSuit = 'Diamonds';
        const spadesBroken = false;
        const handDoesNotHaveLeadingSuit = false;

        // Act
        const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);

        // Assert
        assert(result === false, 'Playing Spades when Spades are broken is legal');
    });

    test('LegalPlayRules - isCardLegalToPlay() returns false for playing Spades when Spades are NOT broken', () => {
        // Arrange
        const card = { suit: 'Spades', rank: '5' };
        const leadingSuit = 'Diamonds';
        const spadesBroken = false;
        const handDoesNotHaveLeadingSuit = false;

        // Act
        const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);

        // Assert
        assert(result === false, 'Playing Spades when Spades are NOT broken is illegal');
    });

    test('LegalPlayRules - isCardLegalToPlay() returns true for playing any suit when player has no cards of leading suit', () => {
        // Arrange
        const card = { suit: 'Clubs', rank: 'J' };
        const leadingSuit = 'Spades';
        const spadesBroken = true;
        const handDoesNotHaveLeadingSuit = true;

        // Act
        const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);

        // Assert
        assert(result === true, 'Playing any suit when player has no cards of leading suit is legal');
    });

    test('LegalPlayRules - isCardLegalToPlay() returns false for playing different suit when leading suit is available', () => {
        // Arrange
        const card = { suit: 'Heart', rank: '7' };
        const leadingSuit = 'Clubs';
        const spadesBroken = true;
        const handDoesNotHaveLeadingSuit = false;

        // Act
        const result = LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit);

        // Assert
        assert(result === false, 'Playing different suit when leading suit is available is illegal');
    });
}
