import React, {useEffect, useMemo, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import apiLinks, {createAuthHeader} from "../../data/appConfig";
import {Tables} from "../../types/explorationParams";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import PersonInfoTable from "../Explore/EntityTables/PersonInfoTable";
import {addNonTypedRelation, updateJurPersonCreationParams} from "../../redux/actions/CreationParamsActions";
import LoaderSpinner from "../components/LoaderSpinner";
import store, {RootState} from "../../redux/store";
import {CreationModalSettings} from "./Create";
import {JurPerson} from "../../types/JurPerson";
import Person from "../../types/Person";
import {getPersonFromResponse} from "../../data/pureFunctions";
import {CreationModalModes} from "../../types/CreationModalModes";

type Props = {
    modalSettings: CreationModalSettings,
    close: ()=>void
}

// @todo key press handlers
/**
 *  whitelist of modes(instances of CreationModalModes), which are make this component shown
 */
const whitelist: Array<CreationModalModes> = [CreationModalModes.SET_BEN_OWNER, CreationModalModes.SET_OWNER, CreationModalModes.SET_RELATIONSHIP];

function ApplyPersonModal ({modalSettings, close}: Props) {

    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(state => state.authentication?.accessToken)

    const [isValid, setIsValid] = useState<boolean>(true)

    const [person, setPerson] = useState<Person|null>(null);
    /**
     * state of modal input pending
     */
    const [pending, setPending] = useState<boolean>(false);
    /**
     * requestTimerId stores the id of pending timer for remove this timer when component unmounts
     */
    const [requestTimerId, setRequestTimerId] = useState<NodeJS.Timeout|null>(null)

    useEffect(() => {
        if (modalSettings) {
            const state = store.getState() as RootState;
            switch (modalSettings?.mode) {
                case CreationModalModes.SET_OWNER: {
                    const owner = state.creationParams?.jurPersonCreationData.owner;
                    if (owner) {
                        setPerson(owner)
                    }
                    break
                }

                case CreationModalModes.SET_BEN_OWNER: {
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

        const response = await fetch(`${apiLinks[Tables.PERSONS]}/${id}`, {
            headers: {
                ...createAuthHeader(accessToken)
            }
        });

        let responsePerson: Person | null = null;

        try {
            responsePerson = getPersonFromResponse(await response.json());
        } catch (e) {}

        if (response.ok&&responsePerson) {
            setPerson(responsePerson)
        } else {
            setPerson(null)
        }

        setPending(false)
    }

    const handleClose = () => {
        close()
        setPerson(null)
    };

    const applyPerson = () => {
        if (person===null) {
            close();
            throw new Error("applied person was null but it shouldn't")
        }

        switch (modalSettings?.mode) {
            case CreationModalModes.SET_OWNER:
            case CreationModalModes.SET_BEN_OWNER: {
                const payload: Partial<JurPerson> = {}

                if (modalSettings.mode===CreationModalModes.SET_OWNER) {
                    payload.owner = person;
                } else {
                    payload.benOwner = person;
                }

                dispatch(updateJurPersonCreationParams(payload))
                break
            }

            case CreationModalModes.SET_RELATIONSHIP: {
                dispatch(addNonTypedRelation(person))
            }
        }

        handleClose()
    }

    const clearPerson = () => {
        switch (modalSettings?.mode) {
            case CreationModalModes.SET_OWNER:
            case CreationModalModes.SET_BEN_OWNER: {
                const payload: Partial<JurPerson> = {}
                if (modalSettings.mode===CreationModalModes.SET_OWNER) {
                    payload.owner = null;
                } else {
                    payload.benOwner = null;
                }
                dispatch(updateJurPersonCreationParams(payload))
                break
            }
        }
        handleClose()
    }
    // update this list every new apply person modal;

    let show: boolean = false;
    let showClearBtn: boolean = false;

    if (modalSettings) {
        show = whitelist.includes(modalSettings.mode);
        showClearBtn = (modalSettings.mode!==CreationModalModes.SET_RELATIONSHIP);
    }

    return (
        <>
            <Modal size={"xl"} className="apply-person-modal" show={show} onHide={handleClose}>
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
                                    onKeyDown={e => {
                                        if (e.key==="Enter") {
                                            e.preventDefault()
                                            applyPerson()
                                        }
                                    }}
                                />

                                {pending ?
                                    <div className="loader-container loader-container__apply-person">
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
                    {
                        showClearBtn?
                        <Button variant="secondary" onClick={clearPerson}>
                            Очистити
                        </Button>
                        :
                        null
                    }
                    <Button disabled={!person} variant="primary" onClick={applyPerson}>
                        Додати
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ApplyPersonModal;