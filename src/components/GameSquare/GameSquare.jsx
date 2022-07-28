import React from "react";

import './styles.css';

const GameSquare = props => {
    const innerStyles = {
        backgroundImage: 'url(' + props.square.url + ')'
    }

    const handleSquareClick = (event, square) => {
        props.onSquareClick(event, square);
    }

    return (
        <div className='square-outer'>
            <div
                className={'square-inner' + (props.square.shown ? ' shown' : ' ') + (props.square.matched ? ' matched' : '')}
                style={innerStyles}
                onClick={event => handleSquareClick(event, props.square)}></div>
        </div>
    );
}

export default GameSquare;
