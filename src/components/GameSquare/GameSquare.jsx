import React from "react";

import './styles.css';

const GameSquare = props => {
    const innerStyles = {
        backgroundImage: 'url(' + props.square.url + ')'
    }

    const handleOuterClick = () => {
        const innerEls = document.querySelectorAll('.square-inner');
        innerEls.forEach(el => {
            el.classList.remove('in');
        })
    }

    const handleInnerClick = event => {
        const visibleSquares = document.querySelectorAll(('.square-inner.in')).length;

        event.stopPropagation();

        if (visibleSquares < 2) {
            event.currentTarget.classList.add('in');
        }
    }

    return (
        <div className='square-outer' onClick={handleOuterClick}>
            <div className='square-inner' style={innerStyles} onClick={handleInnerClick}></div>
        </div>
    );
}

export default GameSquare;
