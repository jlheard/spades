// hand.test.js

import { Hand, RANK_ORDER } from '../hand.js';
import { SUITS } from '../deck.js';
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
      
}

