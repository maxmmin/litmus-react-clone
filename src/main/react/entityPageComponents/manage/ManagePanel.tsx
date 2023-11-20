import {TrashIcon} from "../../assets/icons";
import React, {useMemo, useRef, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PrivateComponentWrapper from "../../authorization/PrivateComponentWrapper";
import {Permission} from "../../../redux/types/userIdentity/Role";

type RemovalProps = {
    title: string,
    match: (s: string)=>boolean,
    onSubmit: ()=>any,
    removalPermissions: Permission[]
}

type PanelProps = {
    removalProps: RemovalProps
}

export default function ManagePanel ({removalProps}: PanelProps) {
    const [removalModalVisibility, setRemovalModalVisibility] = useState<boolean>(false);
    return (
        <div className="main-entity-section__manage-entity-container">
            <PrivateComponentWrapper requiredPermissions={removalProps.removalPermissions} mode={"NO_OUTPUT"}>
                <button className="btn manage-entity-container__action-btn manage-entity-container__action-btn_remove"
                        onClick={()=>{
                            setRemovalModalVisibility(true);
                        }}
                >
                    <TrashIcon color={"black"}
                               className={"manage-entity-container__action-icon manage-entity-container__action-icon_remove"}
                    />
                </button>

                <RemovalModal title={removalProps.title}
                              match={removalProps.match}
                              onSubmit={removalProps.onSubmit}
                              show={removalModalVisibility}
                              closeModal={()=>setRemovalModalVisibility(false)}
                />
            </PrivateComponentWrapper>
        </div>
    )
}

type RemovalModalProps = Omit<RemovalProps, "removalPermissions"> & {
    show: boolean,
    closeModal: ()=>any
}

function RemovalModal ({title, match, onSubmit, show, closeModal}: RemovalModalProps) {
    const [input,setInput] = useState("");
    const matched = useMemo(()=>match(input), [input]);

    const rmCallback = () => {
        if (matched) {
            onSubmit();
            closeModal();
        }
    }

    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Підтвердіть видалення</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>{title}</h6>
                <input type="text"
                       className={"form-control"}
                       value={input}
                       onChange={e=>setInput(e.currentTarget.value)}
                       onKeyDown={e=>{
                           if (e.key==="Enter") {
                               e.preventDefault();
                               rmCallback();
                           }
                       }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Скасувати
                </Button>
                <Button variant="primary"
                        disabled={!matched}
                        onClick={rmCallback}>
                    Видалити
                </Button>
            </Modal.Footer>
        </Modal>
    )
}