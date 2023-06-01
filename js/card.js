export class Card {
    constructor(rank, suit) {
      this.rank = rank;
      this.suit = suit;
    }
  
    equals(other) {
      if (this === other) {
        return true;
      }
  
      if (!(other instanceof Card)) {
        return false;
      }
  
      return this.rank === other.rank && this.suit === other.suit;
    }
  
    hashCode() {
      let hash = 17;
      hash = hash * 31 + this.rank.hashCode();
      hash = hash * 31 + this.suit.hashCode();
      return hash;
    }
  
    toString() {
      return `${this.rank} of ${this.suit}`;
    }
  }
  
  String.prototype.hashCode = function() {
    let hash = 0;
    if (this.length === 0) {
      return hash;
    }
    for (let i = 0; i < this.length; i++) {
      const char = this.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  };
  