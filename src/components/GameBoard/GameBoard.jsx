import React from "react";

import './styles.css';
import GameSquare from "../GameSquare/GameSquare";

const GameBoard = props => {
    const styles = {
        margin: '-.25rem'
    }

    return (
        <div id='gameBoard' className='mt-3' style={styles}>
            {props.squares.map((row, i) => (
                <div className='d-flex' key={row[i].url + i}>
                    {row.map((square, j) => (
                        <GameSquare square={square} key={square.url + i + j}/>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default GameBoard;
