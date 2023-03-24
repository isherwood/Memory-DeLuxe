import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button, Col, Dropdown, Form, OverlayTrigger, Popover, Row} from 'react-bootstrap';
import ButtonWithConfirm from "../ButtonWithConfirm/ButtonWithConfirm";
import {FaMoon, FaPlay, FaStop, FaSun, FaUserMinus, FaUserPlus, FaUsers} from "react-icons/fa";
import {IoMdColorPalette} from "react-icons/io";
import {IoGridSharp} from "react-icons/io5";
import {MdBlurOn} from "react-icons/md";

const GameConfig = props => {
    const [name, setName] = useState('');
    const nameInputRef = useRef(null);
    const [boardWidth, setBoardWidth] = useState(0);
    const [boardHeight, setBoardHeight] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [windowResized, setWindowResized] = useState(0);

    const handleCountChange = val => {
        props.onTileCountChange(val);
    }

    const gridOptions = [
        [2, 3], [3, 2],
        [2, 4], [4, 2],
        [2, 5], [5, 2],
        [2, 6], [3, 4], [4, 3],
        [4, 4],
        [3, 6], [6, 3],
        [4, 5], [5, 4],
        [3, 8], [4, 6], [6, 4], [8, 3],
        [4, 7], [7, 4],
        [3, 10], [5, 6], [6, 5], [10, 3],
        [4, 9], [6, 6], [9, 4],
        [4, 10], [5, 8], [8, 5], [10, 4],
        [6, 7], [7, 6],
        [7, 8], [8, 7],
        [6, 10], [10, 6],
        [8, 8],
        [9, 8],
        [10, 8],
        [10, 10]
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

    const previewSizeFactor = 2;

    const getPreviewStyles = () => {
        if (aspectRatio > 1) {
            return {
                width: 100 * previewSizeFactor,
                height: 1 / (aspectRatio / 100 / previewSizeFactor)
            }
        } else {
            return {
                width: aspectRatio * 100 * previewSizeFactor,
                height: 100 * previewSizeFactor
            }
        }
    }

    const popover = (rows, cols) => {
        return (
            <Popover id="tile-count-popover" className='tile-grid-preview-popover'>
                <Popover.Body>
                    <div className='tile-grid-preview d-flex flex-column' style={getPreviewStyles()}>
                        {[...Array(rows)].map((v, i) => (
                            <div className='d-flex flex-fill' key={props.gridDimensions[1] + i}>
                                {[...Array(cols)].map((v, j) => (
                                    <div className='d-flex flex-fill flex-column' key={i * props.gridDimensions[0] + j}>
                                        <div className='tile-grid-preview-tile flex-fill bg-secondary'/>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </Popover.Body>
            </Popover>
        );
    }

    window.onresize = () => {
        // update state to trigger useEffect
        setWindowResized(windowResized + 1);
    }

    // https://stackoverflow.com/a/61786423/1264804
    const debounce = (func, wait, immediate) => {
        let timeout;

        return (...args) => {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // https://stackoverflow.com/a/61786423/1264804
    const doDebounce = useMemo(
        () => debounce((w, h) => {
            setAspectRatio(w / h);
        }, 100),
        []
    );

    useEffect(() => {
        if (props.showPlayers) {
            nameInputRef.current.focus();
        }
    }, [props.showPlayers]);

    useEffect(() => {
        doDebounce(boardWidth, boardHeight);
    }, [boardWidth, boardHeight, doDebounce]);

    useEffect(() => {
        const getConfigHeight = () => {
            return document.getElementById('config').offsetHeight;
        }

        setBoardWidth(window.innerWidth);
        setBoardHeight(window.innerHeight - getConfigHeight());
    }, [windowResized]);

    return (
        <>
            <div id='config' className='d-flex align-items-center mt-3'>
                {!props.gameLocked &&
                    <>
                        <Dropdown size='lg' className='btn-xl tile-count-selector'
                                  disabled={props.gameLocked}
                                  value={JSON.stringify(props.gridDimensions)}
                                  onSelect={handleCountChange}>
                            <Dropdown.Toggle variant="primary">
                                <IoGridSharp className='lead me-2'/>
                                <span className='d-none d-md-inline me-1'>
                                    {props.gridDimensions[0] === 0 && props.gridDimensions[1] === 0
                                        ? 'Tile Count'
                                        : `${props.gridDimensions[0]} × ${props.gridDimensions[1]}`
                                    }
                                </span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {gridOptions.map((option, i) => (
                                    <OverlayTrigger key={i}
                                                    placement="right"
                                                    overlay={popover(option[1], option[0])}>
                                        <Dropdown.Item
                                            eventKey={'[' + option[0] + ',' + option[1] + ']'}>
                                            {option[0] * option[1]} ({option[0]} x {option[1]})
                                        </Dropdown.Item>
                                    </OverlayTrigger>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Button variant='primary' className='btn-xl ms-2 ms-md-3'
                                onClick={handleShowPlayers}>
                            <FaUsers className='lead'/>
                            <span className='d-none d-md-inline ms-2'>Players (optional)</span>
                        </Button>

                        <div className='ms-2 ms-md-3'>
                            <Form.Group>
                                <Form.Check type="checkbox" id='grayscaleCheckbox'
                                            label={<>
                                                <span className='d-none d-md-inline'>Gray</span>
                                                <IoMdColorPalette className='d-md-none'/>
                                            </>}
                                            defaultChecked={props.grayscale}
                                            onClick={e => props.onSetGrayscale(e.currentTarget.checked)}></Form.Check>
                            </Form.Group>

                            <Form.Group>
                                <Form.Check type="checkbox" id='blurCheckbox'
                                            label={<>
                                                <span className='d-none d-md-inline'>Blur</span>
                                                <MdBlurOn className='d-md-none'/>
                                            </>}
                                            defaultChecked={props.blur}
                                            onClick={e => props.onSetBlur(e.currentTarget.checked)}></Form.Check>
                            </Form.Group>
                        </div>
                    </>
                }

                {props.gameLocked && props.currentPlayer &&
                    <div className='lead'>
                        {props.players.map(player => (
                            <span className={'badge fw-normal me-2 my-1' + (
                                player.name === props.currentPlayer ?
                                    ' bg-primary shadow shadow-dark'
                                    : ' bg-secondary')}
                                  key={player.name}>
                                {player.name} <span className='lead fw-bold'>{player.score}</span>
                            </span>
                        ))}
                    </div>
                }

                <div className='ms-auto d-flex align-self-start align-self-md-center align-items-center'>
                    {!props.gameLocked &&
                        <button className='btn btn-success btn-xl ms-1 ms-sm-2 ms-md-3'
                                onClick={props.onStartButtonClick}
                                disabled={props.gridDimensions[0] === 0}>
                            <FaPlay className='lead'/>
                            <span className='d-none d-md-inline ms-2'>Start Game</span>
                        </button>
                    }

                    {props.gameLocked &&
                        <>
                            <div className='me-3 text-center'>
                                <span className='lead fw-bold'>{props.guessCount}</span> Guesses
                            </div>

                            <ButtonWithConfirm variant="danger"
                                               value={<>
                                                   <FaStop className='lead'/>
                                                   <span
                                                       className='d-none d-md-inline ms-1 ms-sm-2 ms-md-3'>End Game</span>
                                               </>}
                                               classes={'btn-xl' + (!props.gameLocked ? ' d-none' : '')}
                                               modalBody={<>Are you sure you want to end the game?</>}
                                               onYes={() => props.onEndButtonClick()}/>
                        </>
                    }

                    <button
                        className={'btn btn-xl ms-1 ms-sm-2 ms-md-3' + (!props.darkMode ? ' btn-dark' : ' btn-secondary')}
                        onClick={props.onDarkModeButtonClick}>
                        {props.darkMode &&
                            <>
                                <FaSun className='lead'/>
                                <span className='d-none d-md-inline ms-2'>Light Mode</span>
                            </>
                        }
                        {!props.darkMode &&
                            <>
                                <FaMoon className='lead'/>
                                <span className='d-none d-md-inline ms-2'>Dark Mode</span>
                            </>
                        }
                    </button>
                </div>
            </div>

            {props.showPlayers && !props.gameLocked &&
                <div className='mt-3'>
                    <p>Optionally add two or more players to track game order and score. Names must be unique.</p>

                    <Form.Group className='mb-3'>
                        <Form.Check type="checkbox" id='randomizePlayersCheckbox' label="Randomize players"
                                    defaultChecked={props.randomizePlayers}
                                    onClick={e => props.onSetRandomizePlayers(e.currentTarget.checked)}></Form.Check>
                    </Form.Group>

                    <Row>
                        <Col xs={9} sm={6}>
                            <Form.Control type='text' placeholder='Enter player name' value={name}
                                          onChange={event => setName(event.target.value)}
                                          onKeyUp={handleNameInputKeyup}
                                          ref={nameInputRef}/>
                        </Col>

                        <Col xs={3} sm={6} className='text-end text-sm-start'>
                            <Button variant='secondary'
                                    onClick={handleAddPlayer}><FaUserPlus className='lead'/></Button>
                        </Col>
                    </Row>

                    {props.players.length > 0 &&
                        <h3 className='lead my-3'>Players</h3>
                    }

                    {props.players.map(player => (
                        <Row className='mt-2' key={player.name}>
                            <Col xs={9} sm={6}>{player.name}</Col>

                            <Col xs={3} sm={6} className='text-end text-sm-start'>
                                <Button variant='secondary' onClick={() => props.removePlayer(player.name)}>
                                    <FaUserMinus className='lead'/>
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </div>
            }
        </>
    );
}

export default GameConfig;
