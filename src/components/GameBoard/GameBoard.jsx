import React from "react";

import './styles.css';
import GameBox from "../GameBox/GameBox";

const GameBoard = props => {
    const colCount = props.gridDimensions[0];
    const rowCount = props.gridDimensions[1];

    const handleBoxClick = (event, box) => {
        props.onBoxClick(event, box);
    }

    return (
        <>
            {props.boxes.length === colCount * rowCount &&
                <div id='gameBoard' className='my-3 d-flex flex-column align-items-stretch'>
                    {[...Array(rowCount)].map((v, i) => (
                        <div className='d-flex flex-fill' key={props.boxes[i].url + i}>
                            {[...Array(colCount)].map((v, j) => (
                                <GameBox box={props.boxes[i * colCount + j]}
                                         key={i * colCount + j}
                                         onBoxClick={handleBoxClick}/>
                            ))}
                        </div>
                    ))}
                </div>
            }
        </>
    );
}

export default GameBoard;
