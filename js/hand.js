import { SUITS } from './deck.js';
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

    getLegalPlays(leadingSuit, spadesBroken) {
        const legalPlays = [];

        let handDoesNotHaveLeadingSuit = !this.cards.some(c => c.suit === leadingSuit)

        for (const card of this.cards) {
            if (LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit)) {
                legalPlays.push(card);
            }
        }
        return legalPlays;
    }
}
