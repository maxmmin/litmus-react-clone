import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {ModalMode, ModalSettings} from "./CreateJurPerson";
import requestsUrls, {createAuthHeader} from "../../data/appConfig";
import {Tables} from "../../types/explorationParams";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import GetPersonDto from "../../types/GetPersonDto";
import PersonInfoTable from "../Explore/EntityTables/PersonInfoTable";
import CreateJurPersonDto from "../../types/CreateJurPersonDto";
import {updateJurPersonCreationParams} from "../../redux/actions/CreationParamsActions";
import LoaderSpinner from "../components/LoaderSpinner";
import store, {RootState} from "../../redux/store";

type Props = {
    modalSettings: ModalSettings,
    setModalSettings: (prev: ModalSettings) => void
}

function ApplyPersonModal ({modalSettings, setModalSettings}: Props) {

    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(state => state.authentication?.accessToken)

    const [isValid, setIsValid] = useState<boolean>(true)

    const [person, setPerson] = useState<GetPersonDto|null>(null);

    const [pending, setPending] = useState<boolean>(false);

    const [requestTimerId, setRequestTimerId] = useState<NodeJS.Timeout|null>(null)

    useEffect(() => {
        if (modalSettings) {
            const state = store.getState() as RootState;
            switch (modalSettings?.mode) {
                case ModalMode.SET_OWNER: {
                    const owner = state.creationParams?.jurPersonCreationData.owner;
                    if (owner) {
                        setPerson(owner)
                    }
                    break
                }

                case ModalMode.SET_BEN_OWNER: {
                    const benOwner = state.creationParams?.jurPersonCreationData.benOwner;
                    if (benOwner) {
                        setPerson(benOwner)
                    }
                    break;
                }
            }
        }
    }, [modalSettings])

    const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (person) {
            setPerson(null)
        }

        if (requestTimerId) {
            window.clearTimeout(requestTimerId)
            setRequestTimerId(null)
        }

        const id = +e.currentTarget.value;

        if (isValid&&isNaN(id)) {
            setIsValid(false)
        } else if (!isValid&&!isNaN(id)) {
            setIsValid(true)
        }

        if (!isNaN(id)&&accessToken) {
            setPending(true)
            const timerID = setTimeout(()=>fetchPerson(accessToken,id),250)
            setRequestTimerId(timerID)
        }

    }

    const fetchPerson = async (accessToken: string, id: number) => {
        setPending(true)

        const response = await fetch(`${requestsUrls[Tables.PERSONS]}/${id}`, {
            headers: {
                ...createAuthHeader(accessToken)
            }
        });

        let responseJson: GetPersonDto | null = null;

        try {
            responseJson = await response.json() as GetPersonDto;
        } catch (e) {}

        if (response.ok&&responseJson) {
            setPerson(responseJson)
        } else {
            setPerson(null)
        }

        setPending(false)
    }

    const handleClose = () => {
        setModalSettings(null)
        setPerson(null)
    };

    const applyPerson = () => {
        const payload: Partial<CreateJurPersonDto> = {}
        switch (modalSettings?.mode) {
            case ModalMode.SET_OWNER: {
                payload.owner = person;
                break
            }

            case ModalMode.SET_BEN_OWNER: {
                payload.benOwner = person;
                break
            }
        }
        dispatch(updateJurPersonCreationParams(payload))
        handleClose()
    }

    const clearPerson = () => {
        const payload: Partial<CreateJurPersonDto> = {}
        switch (modalSettings?.mode) {
            case ModalMode.SET_OWNER: {
                payload.owner = null;
                break
            }

            case ModalMode.SET_BEN_OWNER: {
                payload.benOwner = null;
                break
            }
        }
        dispatch(updateJurPersonCreationParams(payload))
        handleClose()
    }

    return (
        <>
            <Modal size={"xl"} className="apply-person-modal" show={Boolean(modalSettings)} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Прикріпити особу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Введіть ID</Form.Label>

                            <div className="apply-person__input-container ">
                                <Form.Control
                                    type="text"
                                    placeholder="Example: 43"
                                    autoFocus
                                    className={`${isValid?'':'is-invalid'} ${person?'is-valid':''}`}
                                    onInput={onInputHandler}
                                    defaultValue={person?.id}
                                />

                                {pending ?
                                    <div className="apply-person__loader-container">
                                        <LoaderSpinner/>
                                    </div>
                                :   null
                                }
                            </div>

                        </Form.Group>

                        <div className="apply-person-modal__found-person-container">
                            {person&&!pending?<PersonInfoTable person={person}/>:null}
                        </div>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={clearPerson}>
                        Очистити
                    </Button>
                    <Button disabled={!person} variant="primary" onClick={applyPerson}>
                        Додати
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ApplyPersonModal;