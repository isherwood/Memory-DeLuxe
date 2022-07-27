import {useEffect, useState} from "react";
import {Container, Row} from 'react-bootstrap';

import './App.css';
import GameBoard from "./components/GameBoard/GameBoard";
import GameConfig from "./components/GameConfig/GameConfig";

function App() {
    const [squares, setSquares] = useState([]);
    const [squaresLocked, setSquaresLocked] = useState(false);
    const [gridDimensions, setGridDimensions] = useState();

    const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    const startGame = () => {
        setSquaresLocked(true);
    }

    useEffect(() => {
        const getSquares = count => {
            setSquares([]);
            let newSquares = [];
            let gridSquares = [];

            [...Array(parseInt(count))].forEach(() => {
                const seed = Math.floor(Math.random() * 9999) + 1;
                const imgUrl = 'https://picsum.photos/seed/' + seed + '/300/200';

                // add each image twice
                newSquares.push(imgUrl);
                newSquares.push(imgUrl);
            });

            newSquares = shuffle(newSquares);

            [...Array(gridDimensions[1])].forEach((row, i) => {
                let rowArray = [];

                [...Array(gridDimensions[0])].forEach((square, j) => {
                    rowArray.push(newSquares[i * gridDimensions[0] + j]);
                });

                gridSquares.push(rowArray);
            });

            setSquares(gridSquares);
        }

        if (Array.isArray(gridDimensions)) {
            getSquares((gridDimensions[0] * gridDimensions[1] / 2));
        }
    }, [gridDimensions]);

    return (
        <Container fluid>
            <Row>
                <GameConfig
                    onSquareCountChange={(grid) => setGridDimensions(JSON.parse(grid))}
                    squaresLocked={squaresLocked}
                    onStartGame={startGame}
                />
            </Row>

            <Row>
                <GameBoard
                    squares={squares}/>
            </Row>
        </Container>
    );
}

export default App;
