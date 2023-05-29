import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import apiLinks, {createAuthHeader} from "../../util/appConfig";
import {Tables} from "../../types/explorationParams";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import PersonInfoTable from "../Explore/EntityTables/PersonInfoTable";
import {addRelationship, updateJurPersonCreationParams} from "../../redux/actions/CreationParamsActions";
import LoaderSpinner from "../components/LoaderSpinner";
import store, {RootState} from "../../redux/store";
import {CreationModalSettings} from "./Create";
import {JurPerson} from "../../types/JurPerson";
import Person, {Relationship, RelationshipsLinkObject} from "../../types/Person";
import {getPersonFromResponse, isValid} from "../../util/pureFunctions";
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

    const [searchError, setSearchError] = useState<SearchError|null>(null);

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

        if (e.currentTarget.value==="") {
            setSearchError(null);
            return;
        }

        const id = +e.currentTarget.value;

        let isIdValid = false;

        if (isNaN(id)) {
            setSearchError(new SearchError("Невалідний ідентифікатор", null));
        } else {
            setSearchError(null);
            isIdValid = true;
        }

        if (isIdValid&&isValid(accessToken)) {
            // TODO: Maybe write additional checkup for auth, add global error handler and Authentication error: 05/09
            setPending(true)
            const timerID = setTimeout(()=>fetchPerson(accessToken!,id),250)
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

            if (response.ok&&responsePerson) {
                setPerson(responsePerson)
            } else {
                setPerson(null)
            }

        } catch (e) {
            // set search error if response was with no content
            setSearchError(new SearchError(`Особу з ідентифікатором ${id} не знайдено`, response));
        }

        setPending(false)
    }

    const handleClose = () => {
        close()
        setPerson(null)
        setSearchError(null)
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
                const relationship: Relationship = {
                    note: "", person: person, relationType: null
                }

                const sourceRelObject = new RelationshipsLinkObject(store.getState().creationParams?.personCreationData.relationships);

                if (sourceRelObject?.isPresent(relationship)) {
                    setSearchError(new SearchError("Дана особа вже присутня в списку відносин", null));
                    return;
                }

                dispatch(addRelationship(relationship))
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
                                    className={`${searchError?'is-invalid':''} ${person?'is-valid':''}`}
                                    onInput={onInputHandler}
                                    defaultValue={person?.id}
                                    onKeyDown={e => {
                                        if (e.key==="Enter") {
                                            e.preventDefault()
                                            if (person) {
                                                applyPerson();
                                            }
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

                            {searchError?
                                <p className="apply-person-modal__error-description">{searchError.message}</p>
                                :
                                null
                            }

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
                    <Button disabled={!person||Boolean(searchError)} variant="primary" onClick={applyPerson}>
                        Додати
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ApplyPersonModal;


class SearchError extends Error {
    private readonly _response: Response|null;
    private readonly _message: string;

    constructor(message: string, response: Response|null) {
        super(message);
        this._response = response;
        this._message = message;
    }


    get response(): Response|null {
        return this._response;
    }

    get message(): string {
        return this._message;
    }
}