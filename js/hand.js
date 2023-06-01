import { SUITS } from './card.js';
import { LegalPlayRules } from './legalPlayRules.js';

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

    getLegalPlaysMap(leadingSuit, spadesBroken) {
        const legalPlaysMap = new Map();

        let handDoesNotHaveLeadingSuit = !this.cards.some(c => c.suit === leadingSuit);
    
        this.cards.forEach((card, index) => {
            if (LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit)) {
                legalPlaysMap.set(index, card);
            }
        });
    
        return legalPlaysMap;
    }

    removeCard(card) {
        const index = this.cards.findIndex(c => c.rank === card.rank && c.suit === card.suit);
        if (index !== -1) {
          this.cards.splice(index, 1);
        }
      }    
}
