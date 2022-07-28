import React from "react";
import {Form} from 'react-bootstrap';

const GameConfig = props => {
    const handleCountChange = e => {
        props.onSquareCountChange(e.currentTarget.value);
    }

    const gridOptions = [
        [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [8, 7]
    ]

    return (
        <div id='gameConfig' className='d-flex justify-content-between mt-3'>
            <div className='form-floating'>
                <Form.Select id="squareCount" className="w-auto" onChange={handleCountChange}
                             disabled={props.gameLocked}>
                    <option value='[0,0]'>Select a square count</option>
                    {gridOptions.map(option => (
                        <option value={'[' + option[0] + ',' + option[1] + ']'}
                                key={option[0] + option[1]}>{option[0] * option[1]}</option>
                    ))}
                </Form.Select>
                <Form.Label htmlFor="squareCount">Square Count</Form.Label>
            </div>

            <div>
                <button className={'btn btn-primary btn-xl' + (props.gameLocked ? ' d-none' : '')}
                        onClick={props.onStartButtonClick}
                        disabled={props.gridDimensions[0] === 0}>
                    Start Game
                </button>

                <button className={'btn btn-danger btn-xl' + (!props.gameLocked ? ' d-none' : '')}
                        onClick={props.onEndButtonClick}>
                    End Game
                </button>
            </div>
        </div>
    );
}

export default GameConfig;
