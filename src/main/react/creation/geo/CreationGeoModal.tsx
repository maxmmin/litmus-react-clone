import SelectGeoComponent from "./SelectGeoComponent";
import {Modal} from "react-bootstrap";
import React, { useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useAppSelector} from "../../../redux/hooks";
import {Location} from "../../../model/Location";
import {Entity} from "../../../model/Entity";
import CreationStateManager from "../../../service/creation/stateManager/CreationStateManager";
import CreationStateManagerFactory from "../../../service/creation/stateManager/CreationStateManagerFactory";
import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import store from "../../../redux/store";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import Person from "../../../model/human/person/Person";


type Props = {
    entity: Entity,
    show: boolean,
    close: ()=>void
}

const CreationGeoModal = ({entity, show, close}: Props) => {

    const [location, setLocation] = useState<Location|null>(null)

    const creationStateManager: CreationStateManager<unknown,EntityCreationState<unknown>> = CreationStateManagerFactory.getEntityManager(entity, store);

    const geoLocation = useAppSelector(state => {
        switch (entity) {
            case Entity.JUR_PERSON: {
                return state.creation?.jurPerson?.emergingEntity.location;
            }

            case Entity.PERSON: {
                return state.creation?.person?.emergingEntity.location;
            }
        }
    })

    const handleClose = () => {
        close()
    }

    const clearGeo = () => {
        switch (entity) {
            case Entity.JUR_PERSON: {
                (creationStateManager as CreationStateManager<JurPerson,EntityCreationState<JurPerson>>).updateEntityCreationParams({location: null})
                break;
            }

            case Entity.PERSON: {
                (creationStateManager as CreationStateManager<Person, EntityCreationState<Person>>).updateEntityCreationParams({location: null})
                break;
            }

            default: throw new Error("unsupported entity")
        }
        handleClose()
    }

    const applyGeo = () => {
        if (location) {
            switch (entity) {
                case Entity.JUR_PERSON: {
                    (creationStateManager as CreationStateManager<JurPerson, EntityCreationState<JurPerson>>).updateEntityCreationParams({location: location})

                    break;
                }

                case Entity.PERSON: {
                    (creationStateManager as CreationStateManager<Person, EntityCreationState<Person>>).updateEntityCreationParams({location: location})
                    break;
                }
            }
            handleClose()
        }
    }

    useEffect(()=>{
        if (show) {
            setLocation(geoLocation!)
        }
        /* eslint-disable-next-line */ // -f // set location of api on modal open
    }, [show])


    return (
            <Modal size={"xl"} show={show} onHide={handleClose} className={"creation-page__select-geo-wrapper"}>
                <Modal.Header closeButton>
                    <Modal.Title>Прикріпити адресу</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <SelectGeoComponent location={location} setLocation={setLocation}/>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={clearGeo}>
                        Прибрати геолокацію
                    </Button>
                    <Button variant="primary" onClick={applyGeo}>
                        Затосувати
                    </Button>
                </Modal.Footer>
            </Modal>
        )
}

export default CreationGeoModal;