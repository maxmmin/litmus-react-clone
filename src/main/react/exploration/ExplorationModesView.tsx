import {Entity, EntityExplorationParams, ExplorationMode} from "../../redux/exploration/EntityExplorationState";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {PersonExplorationState} from "../../redux/exploration/person/PersonExploration";
import {JurPersonExplorationState} from "../../redux/exploration/jurPerson/JurPersonExploration";
import {UserExplorationState} from "../../redux/exploration/user/UserExploration";
import ExplorationStateManager from "../../redux/exploration/ExplorationStateManager";
import store from "../../redux/store";
import {EntityType} from "../../model/EntityType";


const ExplorationModesView = () => {
    const dispatch = useAppDispatch();

    const exploredEntity = useAppSelector<Entity|undefined>(state => state.exploration.exploredEntity);

    const explorationParams = useAppSelector<EntityExplorationParams|undefined>(state => {
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

                default: throw new Error("unknown entityService is in the state");
            }
        }
    })

    const explorationManager = useMemo<ExplorationStateManager<EntityType, EntityExplorationParams>|undefined>(()=>{
        if (exploredEntity) {
            switch (exploredEntity) {
                case Entity.PERSON: {
                    return ExplorationStateManager.getPersonManager(store);
                }

                case Entity.JUR_PERSON: {
                    return ExplorationStateManager.getJurPersonManager(store);
                }

                case Entity.USER: {
                    return ExplorationStateManager.getUserManager(store);
                }

                default: throw new Error("unknown entityService is in the state");
            }
        }
    }, [exploredEntity])

    const explorationMode: ExplorationMode|null = explorationParams?explorationParams.mode:null;

    const explorationModes: ExplorationMode[]|null = explorationParams?explorationParams.supportedModes:null;

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>): void {
        const modeIndex = Number(event.currentTarget.value);

        const mode = explorationModes![modeIndex];

        if (mode) {
            explorationManager?.switchExplorationMode(mode);
            return;
        } else  throw new Error("unknown mode");
    }

    if (explorationMode&&explorationModes) {
        return (
            <>
                <p style={{marginBottom: '10px'}}>Пошук за:</p>

                <Form.Select className="explore__select" value={explorationModes.indexOf(explorationMode)} onChange={handleSelectChange}>
                    {explorationModes.map((mode, index)=>
                        <option key={index} value={index}>{mode.title}</option>)
                    }
                </Form.Select>
            </>
        )
    }
    return null;
}

export default ExplorationModesView;