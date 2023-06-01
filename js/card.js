export const RANKS = ['BigJoker', 'ExtraJoker', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
export const SUITS = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];

export class Card {
  constructor(rank, suit) {
    if (!RANKS.includes(rank)) {
      throw new Error(`Invalid card rank: ${rank}`);
    }

    if (!SUITS.includes(suit)) {
      throw new Error(`Invalid card suit: ${suit}`);
    }

    this.rank = rank;
    this.suit = suit;
  }

  equals(card) {
    return this.rank === card.rank && this.suit === card.suit;
  }

  hashCode() {
    const rankCode = this.rank.charCodeAt(0);
    const suitCode = this.suit.charCodeAt(0);
    const prime = 31; // Prime number for hashing
  
    let result = 1;
    result = prime * result + rankCode;
    result = prime * result + suitCode;
  
    return result;
  }

  toString() {
    return `${this.rank} of ${this.suit}`;
  }
}

export function getSuitSymbol(suit) {
  switch (suit) {
    case 'Hearts':
      return '&hearts;';
    case 'Diamonds':
      return '&diams;';
    case 'Clubs':
      return '&clubs;';
    case 'Spades':
      return '&spades;';
    default:
      return '';
  }
}
