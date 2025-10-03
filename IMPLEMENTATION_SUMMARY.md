# Polymorphic Move Execution Implementation

## Overview
This implementation adds polymorphic move execution to differentiate between human and engine players, particularly for pawn promotion handling.

## Problem Statement
The original issue was that human players and engine players should execute moves differently:
- **Human players**: Need a UI popup to choose the promotion piece
- **Engine players**: Should automatically promote based on their calculation
- **Move notation**: Must include the promotion type so the engine knows which piece the opponent promoted to

## Solution

### 1. Player Classes Enhancement

#### Base Player Class (`src/logic/players/Player.js`)
- Added `executeMove(move, game)` method that can be overridden by subclasses
- Returns an object with execution results

#### HumanPlayer Class (`src/logic/players/HumanPlayer.js`)
```javascript
executeMove(move, game) {
  // Check if this is a pawn promotion move
  const isPawnPromotion = /* check if pawn reached end row */
  
  if (isPawnPromotion) {
    return { success: true, needsPromotion: true };
  }
  return { success: true, needsPromotion: false };
}
```

#### EnginePlayer Class (`src/logic/players/EnginePlayer.js`)
```javascript
executeMove(move, game) {
  const isPawnPromotion = /* check if pawn reached end row */
  
  if (isPawnPromotion) {
    const promotionType = move.promotionType || "q";
    return { success: true, promotionType: promotionType };
  }
  return { success: true };
}
```

### 2. Move Notation Update

#### Move Class (`src/logic/Move.js`)
Updated `toChessNotation()` to include promotion type:
```javascript
toChessNotation() {
  const from = this.from.toChessNotation();
  const to = this.to.toChessNotation();
  let notation = `${from}${to}`.toLowerCase();
  
  if (this.promotionType) {
    notation += this.promotionType.toLowerCase();
  }
  
  return notation;
}
```

Examples:
- Regular move: `e2e4`
- Queen promotion: `e7e8q`
- Knight promotion: `e7e8n`
- Rook promotion: `e7e8r`
- Bishop promotion: `e7e8b`

#### Position Class (`src/logic/Position.js`)
Changed `toChessNotation()` to use lowercase letters for UCI compliance:
```javascript
toChessNotation() {
  const file = String.fromCharCode('a'.charCodeAt(0) + this.col);
  const rank = 8 - this.row;
  return `${file}${rank}`;
}
```

### 3. Game Logic Enhancement

#### Game Class (`src/logic/Game.js`)
Added two new methods:

1. **promotePawn()** - Performs actual piece promotion:
```javascript
promotePawn(row, col, piece, promotionType) {
  const pieceMap = { q: Queen, r: Rook, b: Bishop, n: Knight };
  const PieceClass = pieceMap[promotionType.toLowerCase()];
  const promotedPiece = new PieceClass(piece.getColor());
  this.#board.setPiece(new Position(row, col), promotedPiece);
}
```

2. **promotePawnIfNeeded()** - Enhanced to accept promotionType:
```javascript
promotePawnIfNeeded(row, col, piece, promotionType = null) {
  if (/* pawn reached end row */) {
    if (promotionType) {
      this.promotePawn(row, col, piece, promotionType);
    } else {
      piece._needPromotion = true; // For UI popup
    }
  }
}
```

### 4. Component Integration

#### Game Component (`src/components/Game.jsx`)
- Extract promotion type from engine's best move (5th character of UCI notation)
- Pass `promotionType` to the MOVE dispatch
- Update `onPromotion` handler to set `promotionType` in `lastMove`

#### Game Reducer (`src/logic/gameReducerNew.js`)
Updated MOVE case to include promotionType:
```javascript
case "MOVE":
  const { piece, from, to, promotionType } = action.payload;
  const move = new Move(from, to, piece, null, false, 
    { kingside: false, queenside: false }, promotionType || null);
  // ...
```

## Testing

### Test Coverage (40 tests total)

1. **Player Tests** (16 tests) - `src/logic/players/__tests__/Player.test.js`
   - Base Player class functionality
   - HumanPlayer promotion detection
   - EnginePlayer automatic promotion
   - Different promotion types (q, r, b, n)

2. **Move Tests** (10 tests) - `src/logic/__tests__/Move.test.js`
   - UCI notation format
   - Promotion type in notation
   - Lowercase compliance
   - All promotion piece types

3. **Integration Tests** (5 tests) - `src/logic/__tests__/GamePromotion.test.js`
   - Human player promotion flow
   - Engine player automatic promotion
   - Different promotion pieces
   - Notation includes promotion type
   - Manual promotion via UI

4. **Existing Tests** (9 tests)
   - Game class tests
   - Reducer tests
   - All continue to pass

## Benefits

1. **Polymorphism**: Each player type handles moves according to their specific needs
2. **UCI Compliance**: Move notation follows Universal Chess Interface standard
3. **Engine Communication**: Engine receives correct promotion information
4. **Clean Separation**: UI logic separated from engine logic
5. **Extensibility**: Easy to add new player types in the future
6. **Test Coverage**: Comprehensive tests ensure reliability

## Files Modified

- `src/logic/players/Player.js` - Added executeMove method
- `src/logic/players/HumanPlayer.js` - Implemented human-specific executeMove
- `src/logic/players/EnginePlayer.js` - Implemented engine-specific executeMove
- `src/logic/Move.js` - Updated toChessNotation to include promotion
- `src/logic/Position.js` - Changed to lowercase notation
- `src/logic/Game.js` - Added promotion handling methods
- `src/components/Game.jsx` - Updated to handle promotion types
- `src/logic/gameReducerNew.js` - Updated MOVE action to include promotionType

## Files Added

- `src/logic/__tests__/Move.test.js` - Move notation tests
- `src/logic/__tests__/GamePromotion.test.js` - Integration tests

## Build & Test Status

✅ All 40 tests passing
✅ Build successful with no errors or warnings
✅ Zero breaking changes to existing functionality
