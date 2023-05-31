export class LegalPlayRules {
    static isCardLegalToPlay(cardToPlay, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit) {
        if (cardToPlay.suit === leadingSuit) {
            // Playing a card of the same suit is legal with the caveat of spades which can only be lead with if spades are broken
            return cardToPlay.suit !== 'Spades' || spadesBroken;
        } else if (cardToPlay.suit === 'Spades') {
            // if the player does have the suit in their hand this is a renege which we'll get to later.
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
