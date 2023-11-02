import React, {useContext, useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import LoaderSpinner from "../loader/LoaderSpinner";
import store, {RootState} from "../../redux/store";
import {CreationModalSettings} from "./CreationScreen";
import Person from "../../model/human/person/Person";
import {CreationModalModes} from "../../redux/types/creation/CreationModalModes";
import JurPersonCreationStateManager from "../../service/creation/stateManager/jurPerson/JurPersonCreationStateManager";
import PersonCreationStateManager from "../../service/creation/stateManager/person/PersonCreationStateManager";
import {HttpErrorParser} from "../../error/BasicHttpError";
import {ApplicationError} from "../../rest/ErrorResponse";
import {HttpStatus} from "../../rest/HttpStatus";
import {
    SimplePersonResponseDto
} from "../../rest/dto/person/PersonResponseDto";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import JurPersonCreationStateManagerImpl
    from "../../service/creation/stateManager/jurPerson/JurPersonCreationStateManagerImpl";
import {LitmusServiceContext} from "../App";
import PersonExplorationApiService from "../../service/exploration/api/human/person/PersonExplorationApiService";
import {JurPersonCreationParams} from "../../redux/types/creation/JurPersonCreationState";
import {RelationshipCreationParams} from "../../service/creation/PersonCreationService";
import RelationshipsLinkObject from "../../util/relationships/RelationshipsLinkObject";
import PersonPreviewInfoTable from "./PersonPreviewInfoTable";

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

    const [searchError, setSearchError] = useState<ApplicationError|null>(null);

    const [person, setPerson] = useState<SimplePersonResponseDto|null>(null);
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

    const serviceContext = useContext(LitmusServiceContext);
    const personApiService = serviceContext.exploration.apiService.person;
    const personDtoMapper = serviceContext.mappers.person;

    const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (person) {
            setPerson(null)
        }

        if (pending) {
            setPending(false)
        }

        if (requestTimerId) {
            window.clearTimeout(requestTimerId)
            setRequestTimerId(null)
        }

        if (e.currentTarget.value==="") {
            setSearchError(null);
            return;
        }

        const stringId = e.currentTarget.value;
        const id = +stringId;

        // local variable to know if new input valid before setState work
        let isIdValid = false;

        if (isNaN(id)) {
            setSearchError({detail: null,
                status: HttpStatus.UNKNOWN_ERROR,
                error: "Невалідний ідентифікатор",
                code: null,
                type: null,
                properties: null
            });
        } else {
            setSearchError(null);
            isIdValid = true;
        }

        if (isIdValid) {
            // TODO: Maybe write additional checkup for core, add global error handler and Authentication error: 05/09
            setPending(true)
            const timerID = setTimeout(()=>fetchPerson(id, personDtoMapper),250)
            setRequestTimerId(timerID)
        }

    }


    const fetchPerson = async (id: number, mapper: PersonDtoMapper) => {
        const personService: PersonExplorationApiService = personApiService;

        setPending(true)

        try {
            const personResponseDto: SimplePersonResponseDto|null = await personService.findPersonSimpleDto(id);
            const person: Person|null = personResponseDto?mapper.mapSimpleResponseDtoToEntity(personResponseDto):null;
            setPerson(person)
            if (!person) {
                throw new Error(`Особу з ідентифікатором ${id} не знайдено`)
            }
        } catch (e: unknown) {
            const err = HttpErrorParser.parseError(e);
            setSearchError(err);
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
                    const err: ApplicationError = {
                        error: "Дана особа вже присутня в списку відносин",
                        status: HttpStatus.UNKNOWN_ERROR,
                        detail: null, properties: null, type: null,
                        code: null
                    }
                    setSearchError(err);
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
                                <p className="apply-person-modal__error-description">{searchError.error}</p>
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


