export class LegalPlayRules {
    static isCardLegalToPlay(cardToPlay, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit) {
      // Add debug logging
      console.log(`Checking if ${cardToPlay.rank} of ${cardToPlay.suit} is legal to play`);
      console.log(`Leading suit: ${leadingSuit}, Spades broken: ${spadesBroken}, Hand does not have leading suit: ${handDoesNotHaveLeadingSuit}`);
      
      if (leadingSuit === null) {
        // Playing the first card, check if it's a Spade and if spades have been broken
        const isLegal = cardToPlay.suit !== 'Spades' || spadesBroken;
        console.log(`First card of trick: ${isLegal ? 'LEGAL' : 'ILLEGAL'}`);
        return isLegal;
      } else if (cardToPlay.suit === leadingSuit) {
        // Playing a card of the same suit is always legal
        console.log(`Same suit as leading suit: LEGAL`);
        return true;
      } else if (handDoesNotHaveLeadingSuit) {
        // Player has no cards of the leading suit, playing any suit is legal
        // This includes playing Spades even if they're not broken
        console.log(`Player has no cards of leading suit, can play any card: LEGAL`);
        return true;
      } else {
        // Playing a different suit when the leading suit is available
        console.log(`Player has cards of leading suit but played different suit: ILLEGAL`);
        return false;
      }
    }
  }
