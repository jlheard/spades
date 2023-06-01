import { Card } from './card.js';

export const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
export const SUITS = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];

export class Deck {
    constructor() {
        this.cards = [];

        for (const suit of SUITS) {
            for (const rank of RANKS) {
                if (rank === '2' && (suit === 'Hearts' || suit === 'Clubs')) {
                    // Omit 2 of Clubs and 2 of Hearts
                    continue;
                }
                const card = new Card(rank, suit);
                this.cards.push(card);
            }
        }

        // Add the jokers to the deck
        const bigJoker = new Card('BigJoker', 'Spades');
        const extraJoker = new Card('ExtraJoker', 'Spades');
        this.cards.push(bigJoker, extraJoker);
    }

    // Function to shuffle the deck
    shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }

        return this.cards;
    }

    // Function to deal cards from the deck
    dealCards(numCards) {
        if (numCards <= this.cards.length) {
            return this.cards.splice(0, numCards);
        } else {
            console.log('Not enough cards in the deck!');
            return [];
        }
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
