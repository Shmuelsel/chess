import { Player } from "./Player.js";
export class AiPlayer extends Player {
  constructor(color, aiLevel = "medium") {
    super(color, "ai");
    this.aiLevel = aiLevel; // e.g., 'easy', 'medium', 'hard'
    this.setNewStockFishWorker();
  }

  handlePromotion(promotionCallback) {
    // Implement AI player promotion handling (e.g., automatically promote to queen)
  }

  setNewStockFishWorker() {
    if (this.stockFishWorker) {
      this.stockFishWorker.terminate();
    }
    this.engine = new Worker(
      "/stockfish/stockfish-17.1-lite-single-03e3232.js"
    );
    this.engine.postMessage("uci");
  }

  executeMove(historyMoves) {
    return new Promise((resolve) => {
      this.engine.onmessage = (event) => {
        const { data } = event;
        if (data && data.bestMove) {
          resolve(data.bestMove);
        }
      };
      if (historyMoves.length > 0) {
        this.engine.postMessage(`position startpos moves ${historyMoves.join(" ")}`);
        this.engine.postMessage(`go depth ${this.aiLevel}`);
      }else{
        this.engine.postMessage("position startpos");
        this.engine.postMessage(`go depth ${this.aiLevel}`);
      }
    });
  }
}
