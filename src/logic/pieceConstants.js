export const PieceColor = {
    WHITE: 'w',
    BLACK: 'b',
};

export const PieceType = {
    KING: 'k',
    QUEEN: 'q',
    ROOK: 'r',
    BISHOP: 'b',
    KNIGHT: 'n',
    PAWN: 'p'
};

export const PieceImages = {
    [PieceType.KING + PieceColor.BLACK]: require("../assets/images/b_king.png"),
    [PieceType.QUEEN + PieceColor.BLACK]: require("../assets/images/b_queen.png"),
    [PieceType.ROOK + PieceColor.BLACK]: require("../assets/images/b_rook.png"),
    [PieceType.BISHOP + PieceColor.BLACK]: require("../assets/images/b_bishop.png"),
    [PieceType.KNIGHT + PieceColor.BLACK]: require("../assets/images/b_knight.png"),
    [PieceType.PAWN + PieceColor.BLACK]: require("../assets/images/b_pawn.png"),
    [PieceType.KING + PieceColor.WHITE]: require("../assets/images/w_king.png"),
    [PieceType.QUEEN + PieceColor.WHITE]: require("../assets/images/w_queen.png"),
    [PieceType.ROOK + PieceColor.WHITE]: require("../assets/images/w_rook.png"),
    [PieceType.BISHOP + PieceColor.WHITE]: require("../assets/images/w_bishop.png"),
    [PieceType.KNIGHT + PieceColor.WHITE]: require("../assets/images/w_knight.png"),
    [PieceType.PAWN + PieceColor.WHITE]: require("../assets/images/w_pawn.png"),
}
