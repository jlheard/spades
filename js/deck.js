// Define the ranks and suits for the cards
const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];

// Function to initialize the deck
function initializeDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      if (rank === '2' && (suit === 'Hearts' || suit === 'Clubs')) {
        // Omit 2 of Clubs and 2 of Hearts
        continue;
      }
      deck.push({ rank, suit });
    }
  }
  // Add the jokers to the deck
  deck.push({ rank: 'BigJoker', suit: 'Spades' });
  deck.push({ rank: 'ExtraJoker', suit: 'Spades' });
  return deck;
}

// Initialize the deck
let deck = initializeDeck();

// Function to shuffle the deck
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

// Function to deal cards from the deck
function dealCards(deck, numCards) {
  if (numCards <= deck.length) {
    return deck.splice(0, numCards);
  } else {
    console.log('Not enough cards in the deck!');
    return [];
  }
}

// Export the deck and its functions
export { shuffleDeck, dealCards, initializeDeck };
