export class Player {
    #color;
    #type; // 'human' or 'ai'

    constructor(color, type = "human") {
        this.#color = color;
        this.#type = type;
    }

    getColor() {
        return this.#color;
    }

    getType() {
        return this.#type;
    }

    isHuman() {
        return this.#type === "human";
    }

    isAI() {
        return this.#type === "ai";
    }

    executeMove(move) {
        throw new Error("Method 'executeMove' must be implemented by subclasses.");
    }

    handlePromotion(promotionCallback) {
        throw new Error("Method 'handlePromotion' must be implemented by subclasses.");
    }
}