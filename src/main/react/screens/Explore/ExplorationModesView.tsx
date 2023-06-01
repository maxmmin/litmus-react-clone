import {Entity, ExplorationMode} from "../../../redux/exploration/EntityExplorationState";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import store from "../../../redux/store";
import {PersonExplorationParams, PersonExplorationState} from "../../../redux/exploration/PersonExploration";
import {JurPersonExplorationState} from "../../../redux/exploration/JurPersonExploration";
import {UserExplorationState} from "../../../redux/exploration/UserExploration";
import ExplorationManager from "../../../redux/exploration/ExplorationStateManager";


const ExplorationModesView = () => {
    const dispatch = useAppDispatch();

    const exploredEntity = useAppSelector(state => state.exploration.exploredEntity);

    const explorationParams = useAppSelector(state => {
        if (exploredEntity) {
            switch (exploredEntity) {
                case Entity.PERSON: {
                    return (state.exploration.person as PersonExplorationState).params;
                }

                case Entity.JUR_PERSON: {
                    return (state.exploration.jurPerson as JurPersonExplorationState).params;
                }

                case Entity.USER: {
                    return (state.exploration.user as UserExplorationState).params;
                }

                default: throw new Error("unknown entity is in the state");
            }
        }
    })

    const explorationManager = exploredEntity?ExplorationManager.getManager(dispatch, exploredEntity):null;

    const explorationMode: ExplorationMode|null = explorationParams?explorationParams.mode:null;

    const explorationModes: ExplorationMode[]|null = explorationParams?explorationParams.supportedModes:null;

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>): void {

        const mode = (ExplorationMode as any)[event.currentTarget.value]

        if (mode) {
            explorationManager?.switchExplorationMode(mode);
            return;
        }
        throw new Error("unknown mode");
    }

    if (modes&&explorationMode) {
        return (
            <>
                <p style={{marginBottom: '10px'}}>Пошук за:</p>

                <Form.Select className="explore__select" value={explorationMode} onChange={handleSelectChange}>
                    {modes.map(([key, {title}], index)=>
                        <option key={index} value={key}>{title}</option>)
                    }
                </Form.Select>
            </>
        )
    }
    return null;
}

export default ExplorationModesView;