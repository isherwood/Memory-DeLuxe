import {Button, Modal} from 'react-bootstrap';
import {useState} from "react";

const ButtonWithConfirm = props => {
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => {
        setShowModal(false);
        props.onYes();
    }

    return (
        <>
            <Button variant={props.variant} size={props.size} className={props.classes}
                    onClick={() => setShowModal(true)}>
                {props.value}</Button>

            <Modal show={showModal}>
                {props.modalTitle &&
                    <Modal.Header closeButton>
                        <Modal.Title>{props.modalTitle}</Modal.Title>
                    </Modal.Header>
                }

                <Modal.Body>
                    {props.modalBody}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose(true)} autoFocus> Yes </Button>
                    <Button variant="danger" onClick={() => setShowModal(false)}> Cancel </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ButtonWithConfirm;
