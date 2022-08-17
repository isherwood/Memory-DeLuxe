import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Form, Row} from 'react-bootstrap';
import ButtonWithConfirm from "../ButtonWithConfirm/ButtonWithConfirm";
import {FaPlay, FaStop, FaUserMinus, FaUserPlus, FaUsers} from "react-icons/fa";
import {IoGridSharp} from "react-icons/io5";
import {BiImageAdd} from "react-icons/bi";
import {MdDelete} from "react-icons/md";

import './styles.css';
import warningTriangle from '../../images/warning-triangle.png';

const GameConfig = props => {
    const [name, setName] = useState('');
    const nameInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');
    const imageInputRef = useRef(null);
    const [tileCount, setTileCount] = useState(0);
    const [startButtonEnabled, setStartButtonEnabled] = useState(false);

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
        [10, 10]
    ]

    const isValidUrl = str => {
        let url;

        try {
            url = new URL(str);
        } catch (_) {
            return false;
        }

        return url.protocol === "https:";
    }

    const handleCountChange = e => {
        props.onTileCountChange(e.currentTarget.value);
    }

    const handleShowTiles = () => {
        props.onSetShowTiles(!props.showTiles);
    }

    const handleAddImage = () => {
        const imageValid = imageUrl && isValidUrl(imageUrl);

        if (imageValid && !props.customImages.filter(image => image.url === imageUrl).length > 0) {
            props.addCustomImage(imageUrl);
            setImageUrl('');
            imageInputRef.current.focus();
        }
    }

    const handleImageInputKeyup = event => {
        if (event.key === 'Enter') {
            handleAddImage();
        }
    }

    const handleShowPlayers = () => {
        props.onSetShowPlayers(!props.showPlayers);
    }

    const handleAddPlayer = () => {
        if (name && !props.players.filter(player => player.name === name).length > 0) {
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

    // focus the image input when tile config is shown
    useEffect(() => {
        if (props.showTiles && props.useCustomImages && props.tileCount) {
            imageInputRef.current.focus();
        }
    }, [props.showTiles, props.tileCount, props.useCustomImages]);

    // focus the player input when player config is shown
    useEffect(() => {
        if (props.showPlayers) {
            nameInputRef.current.focus();
        }
    }, [props.showPlayers]);

    // enable the start button when conditions allow
    useEffect(() => {
        setStartButtonEnabled(tileCount > 0
            && (!props.useCustomImages || props.customImages.length * 2 === tileCount)
        );
    }, [props.customImages, props.gridDimensions, props.useCustomImages, tileCount])

    // update tile count when grid dimensions change
    useEffect(() => {
        setTileCount(props.gridDimensions[0] * props.gridDimensions[1]);
    }, [props.gridDimensions])

    return (
        <>
            <div className='d-flex align-items-center mt-3'>
                {!props.gameLocked &&
                    <>
                        <Button variant='primary' className='btn-xl'
                                onClick={handleShowTiles}>
                            <IoGridSharp className='lead'/>
                            <span className='d-none d-md-inline ms-2'>Tiles</span>
                        </Button>

                        <Button variant='primary' className='btn-xl ms-2 ms-sm-3'
                                onClick={handleShowPlayers}>
                            <FaUsers className='lead'/>
                            <span className='d-none d-md-inline ms-2'>Players</span>
                        </Button>
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
                        <button className='btn btn-success btn-xl ms-3'
                                onClick={props.onStartButtonClick}
                                disabled={!startButtonEnabled}>
                            <FaPlay className='lead'/>
                            <span className='d-none d-md-inline ms-2'>Start Game</span>
                        </button>
                    }

                    {props.gameLocked &&
                        <>
                            <div className='me-3 text-center'>
                                <span className='lead fw-bold'>{props.guessCount}</span> Guesses
                            </div>

                            <ButtonWithConfirm variant="danger" value={<>
                                <FaStop className='lead'/>
                                <span className='d-none d-md-inline ms-2'>End Game</span>
                            </>}
                                               classes={'btn-xl' + (!props.gameLocked ? ' d-none' : '')}
                                               modalBody={<>Are you sure you want to end the game?</>}
                                               onYes={() => props.onEndButtonClick()}/>
                        </>
                    }
                </div>
            </div>

            {props.showTiles && !props.gameLocked &&
                <>
                    <div className='d-flex flex-row align-items-center mt-3'>
                        <div className='form-floating'>
                            <Form.Select id="tileCount" className="w-auto"
                                         onChange={handleCountChange}
                                         disabled={props.gameLocked}>
                                <option value='[0,0]'>Select count</option>

                                {gridOptions.map((option, i) => (
                                    <option key={i}
                                            value={'[' + option[0] + ',' + option[1] + ']'}>
                                        {option[0] * option[1]} ({option[0]} x {option[1]})
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Label htmlFor="tileCount">Tile Count</Form.Label>
                        </div>

                        <div className='ms-2 ms-sm-3'>
                            <Form.Group>
                                <Form.Check type="checkbox" id='grayscaleCheckbox' label="Gray"
                                            defaultChecked={props.grayscale}
                                            onClick={e => props.onSetGrayscale(e.currentTarget.checked)}></Form.Check>
                            </Form.Group>

                            <Form.Group>
                                <Form.Check type="checkbox" id='blurCheckbox' label="Blur"
                                            defaultChecked={props.blur}
                                            onClick={e => props.onSetBlur(e.currentTarget.checked)}></Form.Check>
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className='mt-2'>
                        <Form.Check type="checkbox" id='customImagesCheckbox' label="Use custom image addresses"
                                    defaultChecked={props.useCustomImages}
                                    onClick={e => props.onSetUseCustomImages(e.currentTarget.checked)}></Form.Check>
                    </Form.Group>

                    {props.useCustomImages && tileCount !== 0 ?
                        <>

                            {(props.customImages.length === 0 || (props.customImages.length * 2 < tileCount)) &&
                                <>
                                    <p className='mt-2'>Image addresses must be secure (https) and unique.</p>

                                    <Row>
                                        <Col xs={9} sm={8}>
                                            <Form.Control type='text' placeholder='Enter an image address'
                                                          value={imageUrl}
                                                          onChange={event => setImageUrl(event.target.value)}
                                                          onKeyUp={handleImageInputKeyup}
                                                          ref={imageInputRef}/>
                                        </Col>

                                        <Col xs={3} sm={4} className='text-end text-sm-start'>
                                            <Button variant='secondary'
                                                    onClick={handleAddImage}><BiImageAdd className='lead'/></Button>
                                        </Col>
                                    </Row>
                                </>
                            }

                            {props.customImages.length > 0 &&
                                <h3 className='lead my-3 mt-4 mb-0'>Images
                                    ({props.customImages.length} of {tileCount / 2})</h3>
                            }

                            {props.customImages.map(image => (
                                <Row className='mt-2' key={image.url}>
                                    <Col xs={9} sm={8} className='d-flex justify-content-between align-items-end'>
                                        <span className='custom-image-url me-2' dir='rtl'>{image.url}</span>
                                        <img src={image.url} alt=''
                                             onError={({ currentTarget }) => {
                                                 currentTarget.src=warningTriangle;
                                             }}
                                             className='custom-image-thumb'/>
                                    </Col>

                                    <Col xs={3} sm={4} className='text-end text-sm-start'>
                                        <Button variant='secondary' onClick={() => props.removeCustomImage(image.url)}>
                                            <MdDelete className='lead'/>
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                        </>
                        : <p className='pt-2'>Please select a tile count.</p>
                    }
                </>
            }

            {props.showPlayers && !props.gameLocked &&
                <div className='mt-3'>
                    <p>Optionally add two or more players to track game order and score. Names must be
                        unique.</p>

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
