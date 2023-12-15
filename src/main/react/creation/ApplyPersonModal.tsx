import React, {useContext, useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import LoaderSpinner from "../loader/LoaderSpinner";
import store, {RootState} from "../../redux/store";
import {CreationModalSettings} from "./CreationScreen";
import Person from "../../model/human/person/Person";
import {CreationModalModes} from "../../redux/types/creation/CreationModalModes";
import JurPersonCreationStateManager from "../../service/stateManagers/creation/jurPerson/JurPersonCreationStateManager";
import PersonCreationStateManager from "../../service/stateManagers/creation/person/PersonCreationStateManager";
import {HttpErrorParser} from "../../error/BasicHttpError";
import PersonDtoMapper from "../../service/dtoMappers/person/PersonDtoMapper";
import JurPersonCreationStateManagerImpl
    from "../../service/stateManagers/creation/jurPerson/JurPersonCreationStateManagerImpl";
import {LitmusServiceContext} from "../App";
import PersonExplorationApiService from "../../service/api/person/exploration/PersonExplorationApiService";
import {JurPersonCreationParams} from "../../redux/types/creation/JurPersonCreationState";
import {RelationshipCreationParams} from "../../service/coreServices/creation/PersonCreationService";
import RelationshipsLinkObject from "../../util/person/RelationshipsLinkObject";
import PersonPreviewInfoTable from "./FastPersonPreview";
import {PersonSimpleResponseDto} from "../../rest/dto/person/PersonSimpleResponseDto";

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

    const [searchError, setSearchError] = useState<string|null>(null);

    const [person, setPerson] = useState<Person|null>(null);
    /**
     * state of modal input pending
     */
    const [pending, setPending] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");

    const serviceContext = useContext(LitmusServiceContext);
    const personApiService = serviceContext.exploration.apiService.person;
    const personDtoMapper = serviceContext.mappers.person;

    useEffect(() => {
        if (modalSettings) {
            const state = store.getState() as RootState;
            switch (modalSettings?.mode) {
                case CreationModalModes.SET_OWNER: {
                    const owner = state.creation?.jurPerson?.emergingEntity.owner;
                    if (owner) {
                        setPerson(owner)
                    }
                    break
                }

                case CreationModalModes.SET_BEN_OWNER: {
                    const benOwner = state.creation?.jurPerson?.emergingEntity.benOwner;
                    if (benOwner) {
                        setPerson(benOwner)
                    }
                    break;
                }
            }
        }
    }, [modalSettings])

    useEffect(() => {
        if (person) {
            setPerson(null)
        }

        if (pending) {
            setPending(false)
        }

        if (input==="") {
            setSearchError(null);
            return;
        }

        const id = +input;

        // local variable to know if new input valid before setState work
        let isIdValid = false;

        if (isNaN(id)) {
            setSearchError("Невалідний ідентифікатор");
        } else {
            setSearchError(null);
            isIdValid = true;
        }

        let requestTimerId: NodeJS.Timeout|null = null;
        let abortController: AbortController = new AbortController();

        if (isIdValid) {
            setPending(true)
            requestTimerId = setTimeout(()=>fetchPerson(id, personDtoMapper, abortController.signal),250)
        }

        return () => {
            if (requestTimerId !== null) {
                window.clearTimeout(requestTimerId);
            }
            abortController.abort();
        }
    }, [input])

    const fetchPerson = async (id: number, mapper: PersonDtoMapper, signal: AbortSignal) => {
        const personService: PersonExplorationApiService = personApiService;

        setPending(true)

        try {
            const personResponseDto: PersonSimpleResponseDto|null = await personService.findSimpleById(id);
            if (!signal.aborted) {
                const person: Person|null = personResponseDto?mapper.mapPreProcessedPersonWithLoss(mapper.mapSimpleDtoToEntity(personResponseDto)):null;
                setPerson(person)
                if (!person) {
                    setSearchError(`Особу з ідентифікатором ${id} не знайдено`)
                }
            }
        } catch (e: unknown) {
            if (!signal.aborted) {
                const err = HttpErrorParser.parseError(e);
                console.error(e);
                setSearchError(HttpErrorParser.getErrorDescription(err));
            }
        } finally {
            if (!signal.aborted) {
                setPending(false);
            }
        }
    }

    const handleClose = () => {
        close()
    };

    const applyPerson = () => {
        if (person===null) {
            close();
            throw new Error("applied person was null but it shouldn't")
        }

        switch (modalSettings?.mode) {
            case CreationModalModes.SET_OWNER:
            case CreationModalModes.SET_BEN_OWNER: {
                const stateManager: JurPersonCreationStateManager = new JurPersonCreationStateManagerImpl();

                const payload: Partial<JurPersonCreationParams> = {}

                if (modalSettings.mode===CreationModalModes.SET_OWNER) {
                    payload.owner = person;
                } else {
                    payload.benOwner = person;
                }

               stateManager.updateEntityCreationParams(payload);
                break
            }

            case CreationModalModes.SET_RELATIONSHIP: {
                const stateManager: PersonCreationStateManager = serviceContext.creation.stateManagers.person;

                const relationship: RelationshipCreationParams = {
                    note: "", to: person, type: null
                }

                const sourceRelObject = new RelationshipsLinkObject(store.getState().creation?.person?.emergingEntity.relationships);

                if (sourceRelObject?.isPresent(relationship)) {
                    setSearchError("Дана особа вже присутня в списку відносин");
                    return;
                }

                stateManager.addRelationship(relationship)
            }
        }

        handleClose()
    }

    const clearPerson = () => {
        switch (modalSettings?.mode) {
            case CreationModalModes.SET_OWNER:
            case CreationModalModes.SET_BEN_OWNER: {
                const stateManager: JurPersonCreationStateManager = new JurPersonCreationStateManagerImpl();
                const payload: Partial<JurPersonCreationParams> = {}
                if (modalSettings.mode===CreationModalModes.SET_OWNER) {
                    payload.owner = null;
                } else {
                    payload.benOwner = null;
                }
               stateManager.updateEntityCreationParams(payload);
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
                                    onInput={e=>setInput(e.currentTarget.value)}
                                    value={input}
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
                                    <div className="apply-person__loader-container">
                                        <LoaderSpinner/>
                                    </div>
                                :   null
                                }
                            </div>

                            {searchError?
                                <p className="apply-person-modal__error-description">{searchError}</p>
                                :
                                null
                            }

                        </Form.Group>

                        <div className="apply-person-modal__found-person-container">
                            {person&&!pending?<PersonPreviewInfoTable person={person}/>:null}
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


