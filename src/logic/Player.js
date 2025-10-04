/**
 * Base Player class
 * Provides abstraction for different player types (Human vs Engine)
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
        return this.#type === 'human';
    }

    isEngine() {
        return this.#type === 'engine';
    }

    /**
     * Execute a move - to be overridden by subclasses
     * @param {Move} move - The move to execute
     * @param {Game} game - The game instance
     * @returns {boolean} - Whether the move was successful
     */
    executeMove(move, game) {
        throw new Error('executeMove must be implemented by subclass');
    }

    /**
     * Handle pawn promotion - to be overridden by subclasses
     * @param {Pawn} pawn - The pawn to promote
     * @param {Position} position - The position of the pawn
     * @param {Game} game - The game instance
     * @param {string} promotionType - Optional promotion type for engine
     * @returns {Piece} - The promoted piece
     */
    handlePromotion(pawn, position, game, promotionType) {
        throw new Error('handlePromotion must be implemented by subclass');
    }
}

/**
 * Human Player - requires UI interaction for moves and promotions
 */
export class HumanPlayer extends Player {
    constructor(color) {
        super(color, 'human');
    }

    executeMove(move, game) {
        // Human players execute moves through UI
        // No special handling needed, just execute the move
        return true;
    }

    handlePromotion(pawn, position, game, promotionType = null) {
        // For human players, promotion requires UI popup
        // Mark the pawn as needing promotion
        pawn._needPromotion = true;
        return null; // Will be handled by UI
    }
}

/**
 * Engine Player - automatic move execution and promotion
 */
export class EnginePlayer extends Player {
    constructor(color) {
        super(color, 'engine');
    }

    executeMove(move, game) {
        // Engine players execute moves automatically
        return true;
    }

    handlePromotion(pawn, position, game, promotionType = 'q') {
        // For engine players, automatically promote based on the move notation
        // Default to queen if no promotion type specified
        const { Queen } = require('./pieces/Queen');
        const { Rook } = require('./pieces/Rook');
        const { Bishop } = require('./pieces/Bishop');
        const { Knight } = require('./pieces/Knight');

        let promotedPiece;
        switch (promotionType) {
            case 'q':
                promotedPiece = new Queen(pawn.getColor());
                break;
            case 'r':
                promotedPiece = new Rook(pawn.getColor());
                break;
            case 'b':
                promotedPiece = new Bishop(pawn.getColor());
                break;
            case 'n':
                promotedPiece = new Knight(pawn.getColor());
                break;
            default:
                promotedPiece = new Queen(pawn.getColor());
        }

        game.getBoard().setPiece(position, promotedPiece);
        return promotedPiece;
    }
}
