// hand.test.js

import { Card, RANKS, SUITS } from '../card.js';
import { Hand } from '../hand.js';
import { assert, test, beforeEach, setTestFile } from './testUtils.js';

export function handTest() {
    beforeEach(() => {
        // Set up any necessary test data or configurations
    });

    setTestFile("hand.test.js");

    test('Hand - sortCards() sorts the cards with all ranks for each suit', () => {
        // Arrange
        const hand = new Hand();
        const ranks = RANKS.slice(); // Copy the array
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

    test('Hand - removeCard() removes the specified card from the hand', () => {
        // Arrange
        const hand = new Hand();
        const card1 = new Card('A', 'Hearts');
        const card2 = new Card('10', 'Hearts');
        const card3 = new Card('K', 'Spades');
        const card4 = new Card('7', 'Clubs');
        hand.setCards([card1, card2, card3, card4]);

        // Act
        hand.removeCard(card2);

        // Assert
        const remainingCards = hand.getCards();
        assert(
            remainingCards.length === 3,
            'Number of cards is correct after removal'
        );
        assert(
            remainingCards.includes(card1),
            'Card 1 is still present in the hand'
        );
        assert(
            !remainingCards.includes(card2),
            'Card 2 is removed from the hand'
        );
        assert(
            remainingCards.includes(card3),
            'Card 3 is still present in the hand'
        );
        assert(
            remainingCards.includes(card4),
            'Card 4 is still present in the hand'
        );
    });    
    
}

