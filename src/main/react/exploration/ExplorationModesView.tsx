import {
    Entity,
    EntityExplorationParams,
    EntityExplorationState,
    ExplorationMode
} from "../../redux/exploration/EntityExplorationState";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import ExplorationStateManager from "../../redux/exploration/ExplorationStateManager";
import store from "../../redux/store";
import PersonExplorationState from "../../redux/exploration/person/PersonExplorationState";
import JurPersonExplorationState from "../../redux/exploration/jurPerson/JurPersonExplorationState";
import UserExplorationState from "../../redux/exploration/user/UserExplorationState";
import explorationStateManager from "../../redux/exploration/ExplorationStateManager";


const ExplorationModesView = () => {
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

    const explorationManager = useMemo<ExplorationStateManager<EntityExplorationState<any, any>>|undefined>(()=>{
       if (exploredEntity) {
           return explorationStateManager.getEntityManager(store, exploredEntity)
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