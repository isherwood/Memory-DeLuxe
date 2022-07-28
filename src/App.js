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

    const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    const handleSquareClick = (event, square) => {
        const shownSquareCount = squares.filter(square => square.shown === true).length;

        if (!shownSquareCount) {
            setFirstSquare(square);
        }

        if (shownSquareCount < 2) {
            setSquares(current => current.map(obj => {
                if (obj.id === square.id) {
                    return {...obj, shown: true}
                }

                return obj;
            }));
        }

        if (shownSquareCount === 1) {
            setSecondSquare(square);
        }

        if (shownSquareCount === 2) {
            setFirstSquare({});
            setSecondSquare({});
            setSquares(current => current.map(obj => {
                    return {...obj, shown: false}
                })
            );
        }
    }

    useEffect(() => {
        if (firstSquare['url'] === secondSquare['url']) {
            // set the first square matched property to true
            setSquares(current => current.map(obj => {
                if (obj.id === firstSquare['id'] || obj.id === secondSquare['id']) {
                    return {...obj, matched: true}
                }

                return obj;
            }));

            // set the second square matched property to true
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
        }
    }, [firstSquare, secondSquare]);

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

    return (
        <Container fluid>
            <Row>
                <GameConfig
                    onSquareCountChange={(grid) => setGridDimensions(JSON.parse(grid))}/>
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
