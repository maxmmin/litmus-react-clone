import SelectGeoComponent from "./SelectGeoComponent";
import {Modal} from "react-bootstrap";
import React, {useEffect, useMemo, useState} from "react";
import Button from "react-bootstrap/Button";
import {useAppSelector} from "../../../redux/hooks";
import {GeoLocation} from "../../../model/GeoLocation";
import {Entity} from "../../../model/Entity";
import JurPersonCreationStateManager
    from "../../../service/creation/stateManager/jurPerson/JurPersonCreationStateManager";
import container from "../../../inversify/inversify.config";
import IOC_TYPES from "../../../inversify/IOC_TYPES";
import PersonCreationStateManager from "../../../service/creation/stateManager/person/PersonCreationStateManager";
import GeoStateManager from "../../../service/creation/stateManager/GeoStateManager";


type Props = {
    entity: Entity,
    show: boolean,
    close: ()=>void
}

const CreationGeoModal = ({entity, show, close}: Props) => {

    const [location, setLocation] = useState<GeoLocation|null>(null)

    const stateManager: GeoStateManager = useMemo<PersonCreationStateManager|JurPersonCreationStateManager>(()=>{
        switch (entity) {
            case Entity.JUR_PERSON: {
                return container.get<JurPersonCreationStateManager>(IOC_TYPES.creation.stateManagers.JurPersonCreationStateManager);
            }
            case Entity.PERSON: {
                return container.get<PersonCreationStateManager>(IOC_TYPES.creation.stateManagers.PersonCreationStateManager);
            }
            default: throw new Error("unsupported entity")
        }
    }, [entity])

    const geoLocation = useAppSelector(state => stateManager.getLocation())

    const handleClose = () => {
        close()
    }

    const clearGeo = () => {
        stateManager.clearLocation();
        handleClose()
    }

    const applyGeo = () => {
        if (location) {
            stateManager.updateLocation(location)
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