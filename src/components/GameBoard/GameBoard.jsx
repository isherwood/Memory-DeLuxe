import React from "react";

import './styles.css';
import GameTile from "../GameTile/GameTile";

const GameBoard = props => {
    const colCount = props.gridDimensions[0];
    const rowCount = props.gridDimensions[1];

    const handleTileClick = (event, tile) => {
        props.onTileClick(event, tile);
    }

    return (
        <>
            {props.tiles.length === colCount * rowCount &&
                <div id='gameBoard' className={'my-3 d-flex flex-column align-items-stretch' +
                    (props.gameComplete ? ' game-ended' : '')}>
                    {[...Array(rowCount)].map((v, i) => (
                        <div className='d-flex flex-fill' key={props.tiles[i].url + i}>
                            {[...Array(colCount)].map((v, j) => (
                                <GameTile tile={props.tiles[i * colCount + j]}
                                          key={i * colCount + j}
                                          onTileClick={handleTileClick}/>
                            ))}
                        </div>
                    ))}
                </div>
            }
        </>
    );
}

export default GameBoard;
