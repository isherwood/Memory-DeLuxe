import {useEffect, useState} from "react";
import {Container, Row} from 'react-bootstrap';

import './App.css';
import GameBoard from "./components/GameBoard/GameBoard";
import GameConfig from "./components/GameConfig/GameConfig";

function App() {
    const [boxes, setBoxes] = useState([]);
    const [firstBox, setFirstBox] = useState({});
    const [secondBox, setSecondBox] = useState({});
    const [gridDimensions, setGridDimensions] = useState([0, 0]);
    const [gameLocked, setGameLocked] = useState(false);
    const [players, setPlayers] = useState([]);
    const [showPlayers, setShowPlayers] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState();
    const [gameComplete, setGameComplete] = useState(false);
    const [guessCount, setGuessCount] = useState(0);

    const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    const handleBoxClick = (event, box) => {
        if (gameLocked) {
            const shownBoxCount = boxes.filter(box => box.shown === true).length;

            // set first box on first click & clear second box
            if (!shownBoxCount && !box.matched) {
                setFirstBox(box);
                setSecondBox({});

                // increment guess count
                setGuessCount(guessCount + 1);
            }

            // show clicked box on first two clicks
            if (shownBoxCount < 2 && !box.matched) {
                setBoxes(current => current.map(obj => {
                    if (obj.id === box.id) {
                        return {...obj, shown: true}
                    }

                    return obj;
                }));
            }

            // set second box on second click if it's not the first box
            if (shownBoxCount === 1 && box.id !== firstBox.id && !box.matched) {
                setSecondBox(box);
            }

            // clear shown and set boxes on third click
            if (shownBoxCount === 2) {

                // advance current player if not a match
                if (currentPlayer && firstBox['url'] !== secondBox['url']) {
                    advanceCurrentPlayer();
                }

                setBoxes(current => current.map(obj => {
                    return {...obj, shown: false}
                }));

                setFirstBox({});
                setSecondBox({});
            }
        }
    }

    const handleStartButtonClick = () => {
        setGameLocked(true);

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
        setShowPlayers(false);
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

    const checkBoxes = () => {

        // check for a match
        if (firstBox['url'] === secondBox['url']) {

            // set the first box matched property to true
            setBoxes(current => current.map(obj => {
                if (obj.id === firstBox['id'] || obj.id === secondBox['id']) {
                    return {...obj, matched: true}
                }

                return obj;
            }));

            // repeat to set the second box matched property to true
            setBoxes(current => current.map(obj => {
                if (obj.id === firstBox['id'] || obj.id === secondBox['id']) {
                    return {...obj, matched: true}
                }

                return obj;
            }));

            // set the shown property of all boxes to false
            setBoxes(current => current.map(obj => {
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

    // initialize boxes
    useEffect(() => {
        const getBoxes = count => {
            setBoxes([]);
            let newBoxes = [];

            [...Array(count)].forEach((v, i) => {
                const seed = Math.floor(Math.random() * 9999) + 1;
                const imgUrl = 'https://picsum.photos/seed/' + seed + '/600/400';

                // add each image twice
                newBoxes.push({
                    id: i + 'a',
                    url: imgUrl,
                    shown: false,
                    matched: false
                });
                newBoxes.push({
                    id: i + 'b',
                    url: imgUrl,
                    shown: false,
                    matched: false
                });
            });

            newBoxes = shuffle(newBoxes);
            setBoxes(newBoxes);
        }

        if (Array.isArray(gridDimensions)) {
            getBoxes((gridDimensions[0] * gridDimensions[1] / 2));
        }
    }, [gridDimensions]);

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

    // check boxes for a match
    useEffect(() => {
        if (secondBox.url) {
            checkBoxes();
        }
        // eslint-disable-next-line
    }, [secondBox]);

    // check for game completion
    useEffect(() => {
        if (boxes.length) {
            const unmatchedBoxes = boxes.filter(box => !box.matched);

            if (!unmatchedBoxes.length) {
                setGameComplete(true);
            }
        }
    }, [boxes]);

    return (
        <Container fluid className={'d-flex flex-column vh-100' + (gameLocked ? ' game-locked' : '')}>
            <Row>
                <GameConfig
                    onBoxCountChange={(grid) => setGridDimensions(JSON.parse(grid))}
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
                    guessCount={guessCount}/>
            </Row>

            <Row className='flex-fill'>
                {boxes.length > 0 ?
                    <GameBoard
                        boxes={boxes}
                        gridDimensions={gridDimensions}
                        onBoxClick={handleBoxClick}
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
