/**
 * Base Player class
 * Represents a generic player in the chess game
 */
export class Player {
  #color;
  #type;

  constructor(color, type) {
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

  isEngine() {
    return this.#type === "engine";
  }
}
