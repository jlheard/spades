export class LegalPlayRules {
    static isCardLegalToPlay(cardToPlay, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit) {
      if (leadingSuit === null) {
        // Playing the first card, check if it's a Spade and if spades have been broken
        return cardToPlay.suit !== 'Spades' || spadesBroken;
      } else if (cardToPlay.suit === leadingSuit) {
        // Playing a card of the same suit is legal with the caveat of spades which can only be led if spades are broken
        return cardToPlay.suit !== 'Spades' || spadesBroken;
      } else if (cardToPlay.suit === 'Spades') {
        // If the player does not have the leading suit in their hand, this is a renege
        return handDoesNotHaveLeadingSuit;
      } else if (cardToPlay.suit !== leadingSuit && handDoesNotHaveLeadingSuit) {
        // Player has no cards of the leading suit, playing any suit is legal
        return true;
      } else {
        // Playing a different suit when the leading suit is available
        return false;
      }
    }
  }
  