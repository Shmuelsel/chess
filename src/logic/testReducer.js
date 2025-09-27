// רידוסר פשוט לבדיקת החיבור
export const testGetInitialState = () => {
  console.log("TEST: testGetInitialState called");
  return {
    test: "working",
    counter: 0,
    game: null, // הוספנו זאת כדי שהקומפוננטה לא תתרסק
    selectedSquare: null,
    selectedPiece: null,
    validMoves: [],
    threatenedSquares: [],
    turn: "w",
    lastMove: null,
    moves: [],
    redoMoves: [],
    updateCounter: 0,
  };
};

export function testReducer(state, action) {
  console.log("TEST REDUCER: Got action", action.type);
  console.log("TEST REDUCER: State:", state);

  switch (action.type) {
    case "TEST_ACTION":
      console.log("TEST REDUCER: Processing TEST_ACTION");
      return {
        ...state,
        counter: state.counter + 1,
      };
    default:
      console.log("TEST REDUCER: Default case");
      return state;
  }
}
