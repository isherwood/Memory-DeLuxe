import React, {useState} from "react";
import {Button, Col, Form, Row} from 'react-bootstrap';
import ButtonWithConfirm from "../ButtonWithConfirm/ButtonWithConfirm";

const GameConfig = props => {
    const [showPlayers, setShowPlayers] = useState(false);
    const [name, setName] = useState('');
    const nameInput = React.createRef();

    const handleCountChange = e => {
        props.onSquareCountChange(e.currentTarget.value);
    }

    const gridOptions = [
        [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [8, 7]
    ]

    const handleShowPlayers = () => {
        setShowPlayers(!showPlayers);

        // setTimeout(() => {
        //     nameInput.current.focus();
        // });
    }

    const handleAddPlayer = () => {
        if (name && !props.players.includes(name)) {
            props.addPlayer(name);
            setName('');
            nameInput.current.focus();
        }
    }

    const handleNameInputKeyup = event => {
        if (event.key === 'Enter') {
            handleAddPlayer();
        }
    }

    return (
        <>
            <div className='d-flex align-items-center mt-3'>
                {!props.gameLocked &&
                    <>
                        <div className='form-floating'>
                            <Form.Select id="squareCount" className="w-auto"
                                         onChange={handleCountChange}
                                         disabled={props.gameLocked}>
                                <option value='[0,0]'>Select a square count</option>
                                {gridOptions.map(option => (
                                    <option value={'[' + option[0] + ',' + option[1] + ']'}
                                            key={option[0] + option[1]}>{option[0] * option[1]}</option>
                                ))}
                            </Form.Select>
                            <Form.Label htmlFor="squareCount">Square Count</Form.Label>
                        </div>

                        <Button variant='primary' className='btn-xl ms-2'
                                onClick={handleShowPlayers}>Players (optional)</Button>
                    </>
                }

                {props.gameLocked && props.currentPlayer &&
                    <div className='lead'>
                        <p>Current player: <b>{props.currentPlayer}</b></p>

                        <p>Scores: </p>
                    </div>
                }

                <div className='ms-auto'>
                    <button className={'btn btn-primary btn-xl' + (props.gameLocked ? ' d-none' : '')}
                            onClick={props.onStartButtonClick}
                            disabled={props.gridDimensions[0] === 0}>
                        Start Game
                    </button>

                    <ButtonWithConfirm variant="danger" size="xl" value='End Game'
                                       classes={(!props.gameLocked ? ' d-none' : '')}
                                       modalBody={<>Are you sure you want to end the game?</>}
                                       onYes={() => props.onEndButtonClick()}/>
                </div>
            </div>

            {showPlayers && !props.gameLocked &&
                <div className='mt-3'>
                    <p>Optionally add players to track game order and score. Names must be unique.</p>

                    <Row>
                        <Col>
                            <Form.Control type='text' placeholder='Enter player name' value={name}
                                          onChange={event => setName(event.target.value)}
                                          onKeyUp={handleNameInputKeyup}
                                          ref={nameInput}/>
                        </Col>

                        <Col>
                            <Button variant='secondary'
                                    onClick={handleAddPlayer}><b>+</b></Button>
                        </Col>
                    </Row>

                    {props.players.map(player => (
                        <Row className='mt-2 px-2' key={player.name}>
                            <Col>{player.name}</Col>

                            <Col><Button variant='secondary'
                                         onClick={() => props.removePlayer(player.name)}><b>&ndash;</b></Button>
                            </Col>
                        </Row>
                    ))}
                </div>
            }
        </>
    );
}

export default GameConfig;
