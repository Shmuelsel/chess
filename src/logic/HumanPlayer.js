import { Player } from "./Player.js";
export class HumanPlayer extends Player {
    constructor(color) {
        super(color, "human");
    }

    executeMove(move) {
        
    }

    handlePromotion(promotionCallback) {
        // Implement human player promotion handling (e.g., show UI for promotion)
    }


}