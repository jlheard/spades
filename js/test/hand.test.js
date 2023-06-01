// hand.test.js

import { Card, SUITS } from '../card.js';
import { Hand, RANK_ORDER } from '../hand.js';
import { assert, test, beforeEach, setTestFile } from './testUtils.js';

export function handTest() {
    beforeEach(() => {
        // Set up any necessary test data or configurations
    });

    setTestFile("hand.test.js");

    test('Hand - sortCards() sorts the cards with all ranks for each suit', () => {
        // Arrange
        const hand = new Hand();
        const ranks = RANK_ORDER.slice(); // Copy the array
        const expectedSortedCards = [];

        // Generate expected sorted cards
        for (const suit of SUITS) {
            for (const rank of ranks) {
                expectedSortedCards.push({ rank, suit });
            }
        }

        // Shuffle the cards to test the sorting functionality
        const shuffledCards = expectedSortedCards.slice().sort(() => Math.random() - 0.5);

        // Act
        hand.setCards(shuffledCards);
        hand.sortCards();
        const sortedCards = hand.getCards();

        // Assert
        assert(
            sortedCards.length === expectedSortedCards.length,
            'Number of cards is correct'
        );

        for (let i = 0; i < sortedCards.length; i++) {
            assert(
                sortedCards[i].rank === expectedSortedCards[i].rank,
                `Card at index ${i} has correct rank`
            );
            assert(
                sortedCards[i].suit === expectedSortedCards[i].suit,
                `Card at index ${i} has correct suit`
            );
        }
    });

    test('Hand - getLegalPlaysMap() returns a map of legal plays with card indexes', () => {
        // Arrange
        const hand = new Hand();
        hand.setCards([
            new Card('A', 'Hearts'),
            new Card('10', 'Hearts'),
            new Card('K', 'Spades'),
            new Card('7','Clubs'),
        ]);
    
        const leadingSuit = 'Hearts';
        const spadesBroken = true;
    
        // Act
        const legalPlaysMap = hand.getLegalPlaysMap(leadingSuit, spadesBroken);
    
        // Assert
        assert(legalPlaysMap.size === 2, 'Correct number of legal plays');
        assert(legalPlaysMap.has(1), 'Legal play - Hearts 10');
        assert(legalPlaysMap.has(0), 'Legal play - Hearts A');
    });
    
    test('Hand - getLegalPlaysMap() returns an empty map when no legal plays are available', () => {
        // Arrange
        const hand = new Hand();
        hand.setCards([
            new Card('J', 'Spades'),
            new Card('5', 'Spades'),
        ]);
    
        const leadingSuit = 'Spades';
        const spadesBroken = false;
    
        // Act
        const legalPlaysMap = hand.getLegalPlaysMap(leadingSuit, spadesBroken);
    
        // Assert
        assert(legalPlaysMap.size === 0, 'No legal plays available');
    });
    
}

