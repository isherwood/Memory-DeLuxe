import React from "react";

import './styles.css';
import GameSquare from "../GameSquare/GameSquare";

const GameBoard = props => {
    const colCount = props.gridDimensions[0];
    const rowCount = props.gridDimensions[1];

    const handleSquareClick = (event, square) => {
        props.onSquareClick(event, square);
    }

    return (
        <>
            {props.squares.length === colCount * rowCount &&
                <div id='gameBoard' className='my-3 d-flex flex-column align-items-stretch'>
                    {[...Array(rowCount)].map((v, i) => (
                        <div className='d-flex flex-fill' key={props.squares[i].url + i}>
                            {[...Array(colCount)].map((v, j) => (
                                <GameSquare square={props.squares[i * colCount + j]}
                                            key={i * colCount + j}
                                            onSquareClick={handleSquareClick}/>
                            ))}
                        </div>
                    ))}
                </div>
            }
        </>
    );
}

export default GameBoard;
