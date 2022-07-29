import {useEffect, useState} from "react";
import {Container, Row} from 'react-bootstrap';

import './App.css';
import GameBoard from "./components/GameBoard/GameBoard";
import GameConfig from "./components/GameConfig/GameConfig";

function App() {
    const [squares, setSquares] = useState([]);
    const [firstSquare, setFirstSquare] = useState({});
    const [secondSquare, setSecondSquare] = useState({});
    const [gridDimensions, setGridDimensions] = useState([0, 0]);
    const [gameLocked, setGameLocked] = useState(false);
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState();

    const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    const handleSquareClick = (event, square) => {
        if (gameLocked) {
            const shownSquareCount = squares.filter(square => square.shown === true).length;

            // set first square on first click
            if (!shownSquareCount) {
                setFirstSquare(square);
                setSecondSquare({});
            }

            // show clicked square on first two clicks
            if (shownSquareCount < 2) {
                setSquares(current => current.map(obj => {
                    if (obj.id === square.id) {
                        return {...obj, shown: true}
                    }

                    return obj;
                }));
            }

            // set second square on second click if it's not the first square
            if (shownSquareCount === 1 && square.id !== firstSquare.id) {
                setSecondSquare(square);
            }

            // clear shown and set squares on third click
            if (shownSquareCount === 2) {
                setSquares(current => current.map(obj => {
                    return {...obj, shown: false}
                }));

                setFirstSquare({});
                setSecondSquare({});
            }
        }
    }

    const handleStartButtonClick = () => {
        setGameLocked(true);

        // reset grid to current dimensions to fetch new images
        const currentGridDimensions = gridDimensions;
        setGridDimensions([0, 0]);
        setTimeout(() => {
            setGridDimensions(currentGridDimensions);
        });

        // set the first player as active
        if (players.length) {
            const tempPlayers = [...players];
            tempPlayers[0].active = true;
            setPlayers(tempPlayers);
        }
    }

    const handleEndButtonClick = () => {
        setGameLocked(false);
    }

    const handleAddPlayer = (name) => {
        setPlayers(players => [...players, {name: name}]);
    }

    const handleRemovePlayer = name => {
        setPlayers(players.filter(player => player.name !== name));
    }

    useEffect(() => {

        // check for a match
        if (firstSquare['url'] === secondSquare['url']) {

            // set the first square matched property to true
            setSquares(current => current.map(obj => {
                if (obj.id === firstSquare['id'] || obj.id === secondSquare['id']) {
                    return {...obj, matched: true}
                }

                return obj;
            }));

            // repeat to set the second square matched property to true
            setSquares(current => current.map(obj => {
                if (obj.id === firstSquare['id'] || obj.id === secondSquare['id']) {
                    return {...obj, matched: true}
                }

                return obj;
            }));

            // set the shown property of all squares to false
            setSquares(current => current.map(obj => {
                return {...obj, shown: false}
            }));

            // increment current player score
            setPlayers(current => current.map(obj => {
                if (obj.name === currentPlayer['name']) {
                    return {...obj, score: currentPlayer['score'] + 1}
                }

                return obj;
            }));
        } else {

            // move to the next player
        }
    }, [currentPlayer, firstSquare, secondSquare]);

    useEffect(() => {
        const getSquares = count => {
            setSquares([]);
            let newSquares = [];

            [...Array(count)].forEach((v, i) => {
                const seed = Math.floor(Math.random() * 9999) + 1;
                const imgUrl = 'https://picsum.photos/seed/' + seed + '/300/200';

                // add each image twice
                newSquares.push({
                    id: i + 'a',
                    url: imgUrl,
                    shown: false,
                    matched: false
                });
                newSquares.push({
                    id: i + 'b',
                    url: imgUrl,
                    shown: false,
                    matched: false
                });
            });

            newSquares = shuffle(newSquares);
            setSquares(newSquares);
        }

        if (Array.isArray(gridDimensions)) {
            getSquares((gridDimensions[0] * gridDimensions[1] / 2));
        }
    }, [gridDimensions]);

    useEffect(() => {
        const activePlayer = players.filter(player => player.active)[0];

        if (activePlayer) {
            setCurrentPlayer(activePlayer.name);
        }
    }, [players])

    return (
        <Container fluid className={(gameLocked ? 'game-locked' : '')}>
            <Row>
                <GameConfig
                    onSquareCountChange={(grid) => setGridDimensions(JSON.parse(grid))}
                    gameLocked={gameLocked}
                    gridDimensions={gridDimensions}
                    players={players}
                    addPlayer={handleAddPlayer}
                    removePlayer={handleRemovePlayer}
                    onStartButtonClick={handleStartButtonClick}
                    onEndButtonClick={handleEndButtonClick}/>
            </Row>

            {squares.length > 0 &&
                <Row>
                    <GameBoard
                        squares={squares}
                        gridDimensions={gridDimensions}
                        onSquareClick={handleSquareClick}/>
                </Row>
            }
        </Container>
    );
}

export default App;
