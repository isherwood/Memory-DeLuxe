import React from "react";

const GameSquare = props => {
    const outerStyles = {
        flex: 1,
        margin: '.25rem'
    }
    const innerStyles = {
        backgroundImage: 'url(' + props.square + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingBottom: '66.67%'
    }

    return (
        <div style={outerStyles}>
            <div style={innerStyles}></div>
        </div>
    );
}

export default GameSquare;
