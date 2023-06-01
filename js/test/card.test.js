import { Card, getSuitFromSymbol } from '../card.js';
import { assert, test, beforeEach, setTestFile } from './testUtils.js';

export function cardTest() {
  beforeEach(() => {
    // Set up any necessary test data or configurations
  });

  setTestFile('card.test.js');

  test('Card - equals() returns true for cards with same rank and suit', () => {
    // Arrange
    const card1 = new Card('A', 'Spades');
    const card2 = new Card('A', 'Spades');

    // Act
    const result = card1.equals(card2);

    // Assert
    assert(result === true, 'Cards with same rank and suit should be equal');
  });

  test('Card - equals() returns false for cards with different rank or suit', () => {
    // Arrange
    const card1 = new Card('K', 'Hearts');
    const card2 = new Card('Q', 'Spades');

    // Act
    const result = card1.equals(card2);

    // Assert
    assert(result === false, 'Cards with different rank or suit should not be equal');
  });

  test('Card - hashCode() returns unique hash code for each card', () => {
    // Arrange
    const card1 = new Card('A', 'Spades');
    const card2 = new Card('A', 'Hearts');

    // Act
    const hashCode1 = card1.hashCode();
    const hashCode2 = card2.hashCode();

    // Assert
    assert(hashCode1 !== hashCode2, 'Hash codes should be unique for different cards');
  });

  test('Card - toString() returns string representation of the card', () => {
    // Arrange
    const card = new Card('Q', 'Diamonds');

    // Act
    const result = card.toString();

    // Assert
    assert(result === 'Q of Diamonds', 'toString() should return the expected string representation of the card');
  });

  test('Card - fromCardContentDivElement() creates a new card object from an element', () => {
    // Arrange
    const element = document.createElement('div');
    element.classList.add('card-content');
    element.innerHTML = 'A&nbsp;♠';
  
    // Act
    const card = Card.fromCardContentDivElement(element);
  
    // Assert
    assert(card.rank === 'A', 'The rank of the created card should match the element');
    assert(card.suit === 'Spades', 'The suit of the created card should match the element');
  });  

  test('getSuitFromSymbol() returns the suit for a given symbol', () => {
    // Arrange
    const symbols = ['♥', '♦', '♣', '♠'];
    const expectedSuits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  
    symbols.forEach((symbol, index) => {
      // Act
      const suit = getSuitFromSymbol(symbol);
  
      // Assert
      assert(
        suit === expectedSuits[index],
        `The suit should be "${expectedSuits[index]}" for the symbol "${symbol}"`
      );
    });
  });
}
