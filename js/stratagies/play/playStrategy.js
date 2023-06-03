// playStrategy.js

export class PlayStrategy {
    constructor(player) {
      this.player = player;
    }
  
    playCard(leadingSuit, spadesBroken) {
        const validPlaysMap = this.player.hand.getLegalPlaysMap(leadingSuit, spadesBroken);
        const validPlays = Array.from(validPlaysMap.values());
      
        // Choose a card to play based on the computer player's strategy
        const cardToPlay = this.chooseCardToPlay(validPlays);
      
        // Remove the played card from the computer player's hand
        this.player.hand.removeCard(cardToPlay);
      
        return cardToPlay;
      }
      
      chooseCardToPlay(validPlays) {
        // Default implementation - randomly choose a card to play
        const randomIndex = Math.floor(Math.random() * validPlays.length);
        return validPlays[randomIndex];
      }

  }
  