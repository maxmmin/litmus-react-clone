import SelectGeoComponent from "./SelectGeoComponent";
import {Entity} from "../../../types/explorationParams";
import {Modal, ModalDialog} from "react-bootstrap";
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import Button from "react-bootstrap/Button";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {Location} from "../../../types/Location";
import {updateJurPersonCreationParams, updatePersonCreationParams} from "../../../redux/actions/CreationParamsActions";

type Props = {
    table: Entity,
    show: boolean,
    close: ()=>void
}

const CreationGeoModal = ({table, show, close}: Props) => {

    const dispatch = useAppDispatch()

    const [location, setLocation] = useState<Location|null>(null)

    const geoLocation = useAppSelector(state => {
        switch (table) {
            case Entity.JUR_PERSONS: {
                return state.creationParams?.jurPersonCreationData.location;
            }

            case Entity.PERSONS: {
                return state.creationParams?.personCreationData.location;
            }
        }
    })

    const handleClose = () => {
        close()
    }

    const clearGeo = () => {
        switch (table) {
            case Entity.JUR_PERSONS: {
                dispatch(updateJurPersonCreationParams({location: null}))
            }
        }
        handleClose()
    }

    const applyGeo = () => {
        if (location) {
            switch (table) {
                case Entity.JUR_PERSONS: {
                    dispatch(updateJurPersonCreationParams({location: location}))
                    break;
                }

                case Entity.PERSONS: {
                    dispatch(updatePersonCreationParams({location: location}))
                    break;
                }
            }
            handleClose()
        }
    }

    // eslint-disable-next-line
    useEffect(()=>{
        setLocation(geoLocation!)
    }, [show, table])


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