export class Turn {
    constructor(playerHandElement) {
      this.playerHandElement = playerHandElement;
      this.selectedCard = null;
      this.cardNotPlayed = true;
  
      this.playerHandElement.addEventListener('click', this.handleCardClick.bind(this));
    }
  
    handleCardClick(event) {
      if (event.target.classList.contains('card')) {
        const clickedCardElement = event.target;
  
        if (this.selectedCard) {
          if (clickedCardElement === this.selectedCard && this.cardNotPlayed) {
            this.putCardInPile();
          } else {
            this.selectedCard.classList.remove('selected');
            this.selectedCard = clickedCardElement;
            this.selectedCard.classList.add('selected');
          }
        } else {
          this.selectedCard = clickedCardElement;
          this.selectedCard.classList.add('selected');
        }
      }
    }
  
    putCardInPile() {
      if (this.selectedCard) {
        this.selectedCard.parentElement.removeChild(this.selectedCard);
        const playAreaElement = document.querySelector('.play-area');
        playAreaElement.appendChild(this.selectedCard);
        this.selectedCard.classList.remove('selected');
        this.selectedCard = null;
        this.cardNotPlayed = false;
      }
    }
  }
  