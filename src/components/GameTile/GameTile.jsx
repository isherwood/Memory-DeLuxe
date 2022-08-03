import React from "react";

import './styles.css';

const GameTile = props => {
    const innerStyles = {
        backgroundImage: 'url(' + props.tile.url + ')'
    }

    const handleTileClick = (event, tile) => {
        props.onTileClick(event, tile);
    }

    return (
        <div className='tile-outer'>
            <div
                className={'tile-inner h-100' + (props.tile.shown ? ' shown' : '') + (props.tile.matched ? ' matched' : '')}
                style={innerStyles}
                onClick={event => handleTileClick(event, props.tile)}></div>
        </div>
    );
}

export default GameTile;
