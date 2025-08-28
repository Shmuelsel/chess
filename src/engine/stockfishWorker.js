import STOCKFISH from "stockfish/stockfishjs";

export default class ChessEngine {
  constructor() {
    this.engine = STOCKFISH(); // Worker מוכן
    this.ready = false;
    this.onMessage = null;

    // מאזין לפלט מהמנוע
    this.engine.onmessage = (e) => {
      const line = typeof e === "string" ? e : e.data;
      console.log("Stockfish:", line);

      if (line === "readyok") {
        this.ready = true;
      }

      if (this.onMessage) {
        this.onMessage(line);
      }
    };

    // אתחול המנוע במצב UCI
    this.send("uci");
    this.send("isready");
  }

  // שליחת פקודה למנוע
  send(cmd) {
    console.log("->", cmd);
    this.engine.postMessage(cmd);
  }

  // התחלת משחק חדש
  newGame() {
    this.send("ucinewgame");
    this.send("isready");
  }

  // הגדרת מצב לוח – או לפי FEN או לפי מהלכים
  setPosition({ moves = [], fen = null } = {}) {
    if (fen) {
      this.send("position fen " + fen);
    } else if (moves.length === 0) {
      this.send("position startpos");
    } else {
      this.send("position startpos moves " + moves.join(" "));
    }
  }

  // בקשת המהלך הכי טוב מהמנוע
  getBestMove({ moves = [], fen = null, depth = 12 } = {}) {
    return new Promise((resolve) => {
      this.setPosition({ moves, fen });

      this.onMessage = (line) => {
        if (line.startsWith("bestmove")) {
          const parts = line.split(" ");
          resolve(parts[1]); // המהלך המומלץ
        }
      };

      this.send("go depth " + depth);
    });
  }
}
