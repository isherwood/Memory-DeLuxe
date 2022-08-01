import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Form, Row} from 'react-bootstrap';
import ButtonWithConfirm from "../ButtonWithConfirm/ButtonWithConfirm";

const GameConfig = props => {
    const [name, setName] = useState('');
    const nameInputRef = useRef(null);

    const handleCountChange = e => {
        props.onBoxCountChange(e.currentTarget.value);
    }

    const gridOptions = [
        [3, 2],
        [2, 6], [3, 4], [4, 3],
        [4, 4],
        [3, 6], [6, 3],
        [4, 5], [5, 4],
        [3, 8], [4, 6], [6, 4], [8, 3],
        [3, 10], [5, 6], [6, 5], [10, 3],
        [4, 9], [6, 6], [9, 4],
        [4, 10], [5, 8], [8, 5], [10, 4],
        [6, 7], [7, 6],
        [7, 8], [8, 7],
        [8, 8]
    ]

    const handleShowPlayers = () => {
        props.onSetShowPlayers(!props.showPlayers);
    }

    const handleAddPlayer = () => {
        if (name && !props.players.filter(player => player.name === name).length) {
            props.addPlayer(name);
            setName('');
            nameInputRef.current.focus();
        }
    }

    const handleNameInputKeyup = event => {
        if (event.key === 'Enter') {
            handleAddPlayer();
        }
    }

    useEffect(() => {
        if (props.showPlayers) {
            nameInputRef.current.focus();
        }
    }, [props.showPlayers]);

    return (
        <>
            <div className='d-flex align-items-center mt-3'>
                {!props.gameLocked &&
                    <>
                        <div className='form-floating'>
                            <Form.Select id="boxCount" className="w-auto"
                                         onChange={handleCountChange}
                                         disabled={props.gameLocked}>
                                <option value='[0,0]'>Select a box count</option>
                                {gridOptions.map((option, i) => (
                                    <option key={i}
                                            value={'[' + option[0] + ',' + option[1] + ']'}>
                                        {option[0] * option[1]} ({option[0]} x {option[1]})
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Label htmlFor="boxCount">Box Count</Form.Label>
                        </div>

                        <Button variant='primary' className='btn-xl ms-2'
                                onClick={handleShowPlayers}>Players (optional)</Button>
                    </>
                }

                {props.gameLocked && props.currentPlayer &&
                    <div className='lead'>
                        {props.players.map(player => (
                            <span
                                className={'badge fw-normal me-2' + (
                                    player.name === props.currentPlayer ?
                                        ' bg-primary shadow shadow-dark'
                                        : ' bg-secondary')}
                                key={player.name}>
                                {player.name} {player.score}</span>
                        ))}
                    </div>
                }

                <div className='ms-auto'>
                    <button className={'btn btn-success btn-xl' + (props.gameLocked ? ' d-none' : '')}
                            onClick={props.onStartButtonClick}
                            disabled={props.gridDimensions[0] === 0}>
                        Start Game
                    </button>

                    <ButtonWithConfirm variant="danger" value='End Game'
                                       classes={(!props.gameLocked ? ' d-none' : '')}
                                       modalBody={<>Are you sure you want to end the game?</>}
                                       onYes={() => props.onEndButtonClick()}/>
                </div>
            </div>

            {props.showPlayers && !props.gameLocked &&
                <div className='mt-3'>
                    <p>Optionally add two or more players to track game order and score. Names must be unique.</p>

                    <Row>
                        <Col>
                            <Form.Control type='text' placeholder='Enter player name' value={name}
                                          onChange={event => setName(event.target.value)}
                                          onKeyUp={handleNameInputKeyup}
                                          ref={nameInputRef}/>
                        </Col>

                        <Col>
                            <Button variant='secondary'
                                    onClick={handleAddPlayer}><b>+</b></Button>
                        </Col>
                    </Row>

                    {props.players.length > 0 &&
                        <h3 className='lead my-3'>Players</h3>
                    }

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
