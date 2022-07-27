import React from "react";
import {Form} from 'react-bootstrap';

const GameConfig = props => {
    const handleCountChange = e => {
        props.onSquareCountChange(e.currentTarget.value);
    }

    const gridOptions = [
        [4, 3], [5, 4], [6, 5], [7, 6], [8, 7]
    ]

    return (
        <div id='gameConfig' className='mt-3'>
            <Form.Select aria-label="Square count" className="w-auto" onChange={handleCountChange}>
                <option value='[0,0]'>Select a square count</option>
                {gridOptions.map(option => (
                    <option value={'[' + option[0] + ',' + option[1] + ']'}
                            key={option[0] + option[1]}>{option[0] * option[1]}</option>
                ))}
            </Form.Select>
        </div>
    );
}

export default GameConfig;
