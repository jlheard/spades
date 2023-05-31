import { SUITS } from './deck.js';

export const RANK_ORDER = ['BigJoker', 'ExtraJoker', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

export class Hand {
    constructor() {
      this.cards = [];
    }
  
    setCards(cards) {
        this.cards = Array.isArray(cards) ? cards : [];
    }
  
    getCards() {
      return this.cards;
    }
  
    sortCards() {
      this.cards.sort((a, b) => {
        if (a.suit !== b.suit) {
          return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
        } else {
          return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank);
        }
      });
    }
  
    legalPlays(leadingSuit, leadingRank) {
      // Implement the logic to determine the legal plays
      // based on the leading suit and rank and the cards in the hand
  
      // Placeholder code that returns an empty array
      return [];
    }
  }
  