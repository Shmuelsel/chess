import React from 'react'
import { PieceImages } from '../logic/pieceConstants'
import './PawnPromotion.css'

const PawnPromotion = ({ piece, onPromote }) => {
  const color = piece.getColor();
  const options = [
    { type: 'Queen', label: 'q' },
    { type: 'Rook', label: 'r' },
    { type: 'Bishop', label: 'b' },
    { type: 'Knight', label: 'n' },
  ];

  return (
    <div className="promotion-popup">
      <ul className="promotion-options">
        {options.map(opt => (
          <li
            key={opt.type}
            className="promotion-option"
            onClick={() => onPromote(piece, opt.type)}
          >
            <img
              src={PieceImages[opt.label + color]}
              alt=""
              className="promotion-img"
            />
            {/* <span>{opt.label}</span> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PawnPromotion