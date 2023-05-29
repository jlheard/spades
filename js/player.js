// player.js

export class Player {
    constructor(name) {
      this.name = name;
      this.hand = [];
      this.partner = null;
    }
  
    setPartner(partner) {
      this.partner = partner;
    }
  
    setHand(hand) {
      this.hand = hand;
    }
}
  
  