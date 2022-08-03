import {useEffect, useState} from "react";
import {Container, Row} from 'react-bootstrap';

import './App.css';
import GameBoard from "./components/GameBoard/GameBoard";
import GameConfig from "./components/GameConfig/GameConfig";

function App() {
    const [tiles, setTiles] = useState([]);
    const [firstTile, setFirstTile] = useState({});
    const [secondTile, setSecondTile] = useState({});
    const [gridDimensions, setGridDimensions] = useState([0, 0]);
    const [gameLocked, setGameLocked] = useState(false);
    const [players, setPlayers] = useState([]);
    const [showPlayers, setShowPlayers] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState();
    const [gameComplete, setGameComplete] = useState(false);
    const [guessCount, setGuessCount] = useState(0);
    const [grayscale, setGrayscale] = useState(false);
    const [blur, setBlur] = useState(false);

    const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    const handleTileClick = (event, tile) => {
        if (gameLocked) {
            const shownTileCount = tiles.filter(tile => tile.shown === true).length;

            // set first tile on first click & clear second tile
            if (!shownTileCount && !tile.matched) {
                setFirstTile(tile);
                setSecondTile({});

                // increment guess count
                setGuessCount(guessCount + 1);
            }

            // show clicked tile on first two clicks
            if (shownTileCount < 2 && !tile.matched) {
                setTiles(current => current.map(obj => {
                    if (obj.id === tile.id) {
                        return {...obj, shown: true}
                    }

                    return obj;
                }));
            }

            // set second tile on second click if it's not the first tile
            if (shownTileCount === 1 && tile.id !== firstTile.id && !tile.matched) {
                setSecondTile(tile);
            }

            // clear shown and set tiles on third click
            if (shownTileCount === 2) {

                // advance current player if not a match
                if (currentPlayer && firstTile['url'] !== secondTile['url']) {
                    advanceCurrentPlayer();
                }

                setTiles(current => current.map(obj => {
                    return {...obj, shown: false}
                }));

                setFirstTile({});
                setSecondTile({});
            }
        }
    }

    const handleStartButtonClick = () => {
        setGameLocked(true);
        setShowPlayers(false);

        // set the first player as active
        setPlayers(current => current.map(obj => {
            obj.active = false;
            const matchingPlayerIndex = players.findIndex(player => player.name === obj.name);

            if (matchingPlayerIndex === 0) {
                obj.active = true;
            }

            return obj;
        }));
    }

    const handleEndButtonClick = () => {
        setGameComplete(false);
        setGameLocked(false);
        setGuessCount(0);

        // reset grid to current dimensions to fetch new images
        const currentGridDimensions = gridDimensions;
        setGridDimensions([0, 0]);
        setTimeout(() => {
            setGridDimensions(currentGridDimensions);
        });

        // zero scores & set the first player as active
        setPlayers(current => current.map(obj => {
            obj.active = false;
            obj.score = 0;
            const matchingPlayerIndex = players.findIndex(player => player.name === obj.name);

            if (matchingPlayerIndex === 0) {
                obj.active = true;
            }

            return obj;
        }));
    }

    const handleAddPlayer = (name) => {
        setPlayers(players => [...players, {name: name, score: 0}]);
    }

    const handleRemovePlayer = name => {
        setPlayers(players.filter(player => player.name !== name));
    }

    const advanceCurrentPlayer = () => {
        // the index of the current player among all players
        const currentPlayerIndex = players.findIndex(player => player.active === true);

        setPlayers(current => current.map(obj => {
            // deactivate each player
            obj.active = false;

            // the index of the player who matches the currently looping player
            const matchingPlayerIndex = players.findIndex(player => player.name === obj.name);

            // the looping player is not the last player in the array
            if (currentPlayerIndex < players.length - 1) {

                // the looping player index matches the next player's index
                if (matchingPlayerIndex === currentPlayerIndex + 1) {
                    obj.active = true;
                }

                // the looping player is the last in the array and the matching player is the first player
            } else if (matchingPlayerIndex === 0) {
                obj.active = true;
            }

            return obj;
        }));
    }

    const checkTiles = () => {

        // check for a match
        if (firstTile['url'] === secondTile['url']) {

            // set the first tile matched property to true
            setTiles(current => current.map(obj => {
                if (obj.id === firstTile['id'] || obj.id === secondTile['id']) {
                    return {...obj, matched: true}
                }

                return obj;
            }));

            // repeat to set the second tile matched property to true
            setTiles(current => current.map(obj => {
                if (obj.id === firstTile['id'] || obj.id === secondTile['id']) {
                    return {...obj, matched: true}
                }

                return obj;
            }));

            // set the shown property of all tiles to false
            setTiles(current => current.map(obj => {
                return {...obj, shown: false}
            }));

            // increment current player score
            setPlayers(current => current.map(obj => {
                if (obj.name === currentPlayer) {
                    return {...obj, score: obj.score + 1}
                }

                return obj;
            }));
        }
    }

    // initialize tiles
    useEffect(() => {
        const getTiles = count => {
            setTiles([]);
            let newTiles = [];

            [...Array(count)].forEach((v, i) => {
                const seed = Math.floor(Math.random() * 9999) + 1;
                let imgUrl = 'https://picsum.photos/seed/' + seed + '/600/400';

                if (grayscale && blur) {
                    imgUrl += '?grayscale&blur=10';
                } else if (grayscale) {
                    imgUrl += '?grayscale';
                } else if (blur) {
                    imgUrl += '?blur=10';
                }

                // add each image twice
                newTiles.push({
                    id: i + 'a',
                    url: imgUrl,
                    shown: false,
                    matched: false
                });
                newTiles.push({
                    id: i + 'b',
                    url: imgUrl,
                    shown: false,
                    matched: false
                });
            });

            newTiles = shuffle(newTiles);
            setTiles(newTiles);
        }

        if (Array.isArray(gridDimensions)) {
            getTiles((gridDimensions[0] * gridDimensions[1] / 2));
        }
    }, [blur, grayscale, gridDimensions]);

    // set active player
    useEffect(() => {
        if (players.length > 1) {
            const activePlayer = players.filter(player => player.active)[0];

            if (activePlayer) {
                setCurrentPlayer(activePlayer.name);
            } else {
                setCurrentPlayer(players[0].name);
            }
        }
    }, [players]);

    // check tiles for a match
    useEffect(() => {
        if (secondTile.url) {
            checkTiles();
        }
        // eslint-disable-next-line
    }, [secondTile]);

    // check for game completion
    useEffect(() => {
        if (tiles.length) {
            const unmatchedTiles = tiles.filter(tile => !tile.matched);

            if (!unmatchedTiles.length) {
                setGameComplete(true);
            }
        }
    }, [tiles]);

    return (
        <Container fluid className={'d-flex flex-column vh-100' + (gameLocked ? ' game-locked' : '')}>
            <Row>
                <GameConfig
                    onTileCountChange={(grid) => setGridDimensions(JSON.parse(grid))}
                    gameLocked={gameLocked}
                    gridDimensions={gridDimensions}
                    players={players}
                    showPlayers={showPlayers}
                    currentPlayer={currentPlayer}
                    addPlayer={handleAddPlayer}
                    removePlayer={handleRemovePlayer}
                    onStartButtonClick={handleStartButtonClick}
                    onEndButtonClick={handleEndButtonClick}
                    onSetShowPlayers={setShowPlayers}
                    guessCount={guessCount}
                    grayscale={grayscale}
                    onSetGrayscale={val => setGrayscale(val)}
                    blur={blur}
                    onSetBlur={val => setBlur(val)}/>
            </Row>

            <Row className='flex-fill'>
                {tiles.length > 0 && !showPlayers ?
                    <GameBoard
                        tiles={tiles}
                        gridDimensions={gridDimensions}
                        onTileClick={handleTileClick}
                        gameComplete={gameComplete}/>
                    :
                    <div className='align-self-center mb-4 text-center text-muted opacity-50'>
                        <div className='display-1 fst-italic'>Memory De Luxe</div>
                        <div className='mt-2'>A SeaBee Software production</div>
                    </div>
                }
            </Row>
        </Container>
    );
}

export default App;
