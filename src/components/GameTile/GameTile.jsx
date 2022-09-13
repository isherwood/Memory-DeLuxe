import React from "react";

import './styles.css';
import warningTriangle from "../../images/warning-triangle.png";

const GameTile = props => {
    const innerStyles = () => {
        if (props.tile.error) {
            return {
                backgroundImage: 'url(' + warningTriangle + ')',
                backgroundSize: 'contain'
            }
        } else {
            return {backgroundImage: 'url(' + props.tile.url + ')'}
        }
    }

    const handleTileClick = (event, tile) => {
        props.onTileClick(event, tile);
    }

    return (
        <div className='tile-outer'>
            <div
                className={'tile-inner h-100' + (props.tile.shown ? ' shown' : '') + (props.tile.matched ? ' matched' : '')}
                style={innerStyles()}
                onClick={event => handleTileClick(event, props.tile)}></div>

            <img className="visually-hidden" aria-hidden="true" src={props.tile.url}
                 onError={() => props.tile.error = true} alt="hidden dummy image to test URL"/>
        </div>
    );
}

export default GameTile;
