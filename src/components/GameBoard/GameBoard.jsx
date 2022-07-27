import React from "react";

import GameSquare from "../GameSquare/GameSquare";

const GameBoard = props => {
    console.log(props.squares);

    const styles = {
        margin: '-.25rem'
    }

    return (
        <div id='gameBoard' className='mt-3' style={styles}>
            {props.squares.map((row, i) => (
                <div className='d-flex'>
                    {row.map((square, j) => (
                        <GameSquare square={square} key={square + i + j}/>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default GameBoard;
