// Define the ranks and suits for the cards
const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
export class Deck {
    constructor() {
        this.cards = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                if (rank === '2' && (suit === 'Hearts' || suit === 'Clubs')) {
                    // Omit 2 of Clubs and 2 of Hearts
                    continue;
                }
                this.cards.push({ rank, suit });
            }
        }
        // Add the jokers to the deck
        this.cards.push({ rank: 'BigJoker', suit: 'Spades' });
        this.cards.push({ rank: 'ExtraJoker', suit: 'Spades' });
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
            return this.cards.splice(0, numCards );
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
