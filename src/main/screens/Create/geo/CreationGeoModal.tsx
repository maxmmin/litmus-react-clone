import SelectGeoComponent from "./SelectGeoComponent";
import {Tables} from "../../../types/explorationParams";
import {Modal, ModalDialog} from "react-bootstrap";
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import Button from "react-bootstrap/Button";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {Location} from "../../../types/Location";
import {updateJurPersonCreationParams} from "../../../redux/actions/CreationParamsActions";

type Props = {
    table: Tables,
    show: boolean,
    close: ()=>void
}

const CreationGeoModal = ({table, show, close}: Props) => {

    const dispatch = useAppDispatch()

    const [location, setLocation] = useState<Location|null>(null)

    const geoLocation = useAppSelector(state => {
        switch (table) {
            case Tables.JUR_PERSONS: {
                return state.creationParams?.jurPersonCreationData.location;
            }
        }
    })

    const handleClose = () => {
        close()
    }

    const clearGeo = () => {
        switch (table) {
            case Tables.JUR_PERSONS: {
                dispatch(updateJurPersonCreationParams({location: null}))
            }
        }
        handleClose()
    }

    const applyGeo = () => {
        if (location) {
            switch (table) {
                case Tables.JUR_PERSONS: {
                    dispatch(updateJurPersonCreationParams({location: location}))
                }
            }
            handleClose()
        }
    }

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