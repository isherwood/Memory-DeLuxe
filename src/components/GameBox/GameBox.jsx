import React from "react";

import './styles.css';

const GameBox = props => {
    const innerStyles = {
        backgroundImage: 'url(' + props.box.url + ')'
    }

    const handleBoxClick = (event, box) => {
        props.onBoxClick(event, box);
    }

    return (
        <div className='box-outer'>
            <div
                className={'box-inner h-100' + (props.box.shown ? ' shown' : '') + (props.box.matched ? ' matched' : '')}
                style={innerStyles}
                onClick={event => handleBoxClick(event, props.box)}></div>
        </div>
    );
}

export default GameBox;
