import SelectGeoComponent from "./SelectGeoComponent";
import {Modal} from "react-bootstrap";
import React, { useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {Location} from "../../../model/Location";
import {updateJurPersonCreationParams, updatePersonCreationParams} from "../../../redux/creation/CreationCoreActions";
import {Entity} from "../../../model/Entity";

type Props = {
    entity: Entity,
    show: boolean,
    close: ()=>void
}

const CreationGeoModal = ({entity, show, close}: Props) => {

    const dispatch = useAppDispatch()

    const [location, setLocation] = useState<Location|null>(null)

    const geoLocation = useAppSelector(state => {
        switch (entity) {
            case Entity.JUR_PERSON: {
                return state.creationParams?.jurPersonCreationData.location;
            }

            case Entity.PERSON: {
                return state.creationParams?.personCreationData.location;
            }
        }
    })

    const handleClose = () => {
        close()
    }

    const clearGeo = () => {
        switch (entity) {
            case Entity.JUR_PERSON: {
                dispatch(updateJurPersonCreationParams({location: null}))
            }
        }
        handleClose()
    }

    const applyGeo = () => {
        if (location) {
            switch (entity) {
                case Entity.JUR_PERSON: {
                    dispatch(updateJurPersonCreationParams({location: location}))
                    break;
                }

                case Entity.PERSON: {
                    dispatch(updatePersonCreationParams({location: location}))
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
        /* eslint-disable-next-line */ // -f // set location of lookup on modal open
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