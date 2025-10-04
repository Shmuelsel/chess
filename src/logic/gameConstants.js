/**
 * Game mode constants for chess application
 * Replaces string-based checks with type-safe constants
 */
export const GameMode = {
    PLAYER_VS_PLAYER: 'pvp',
    PLAYER_VS_ENGINE: 'pve',
};

/**
 * Player color constants
 * Already defined in pieceConstants.js but duplicated here for game logic clarity
 */
export const PlayerColor = {
    WHITE: 'w',
    BLACK: 'b',
};

/**
 * Helper functions for game mode checks
 */
export const isPlayerVsEngine = (mode) => mode === GameMode.PLAYER_VS_ENGINE;
export const isPlayerVsPlayer = (mode) => mode === GameMode.PLAYER_VS_PLAYER;

/**
 * Helper functions for color checks
 */
export const isWhite = (color) => color === PlayerColor.WHITE;
export const isBlack = (color) => color === PlayerColor.BLACK;
export const getOpponentColor = (color) => 
    color === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE;
