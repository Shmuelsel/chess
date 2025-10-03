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

  /**
   * Execute a move for this player
   * @param {Move} move - The move to execute
   * @param {Game} game - The game instance
   * @returns {Object} - Result object with success flag and optional promotionType
   */
  executeMove(move, game) {
    // Base implementation - should be overridden by subclasses
    return { success: true, promotionType: null };
  }
}
