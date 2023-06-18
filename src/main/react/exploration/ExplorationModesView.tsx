import EntityExplorationState from "../../redux/types/exploration/EntityExplorationState";
import {Entity} from "../../model/Entity";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useMemo} from "react";
import {useAppSelector} from "../../redux/hooks";
import ExplorationStateManagerImpl from "../../service/exploration/stateManager/ExplorationStateManagerImpl";
import store from "../../redux/store";
import PersonExplorationState from "../../redux/types/exploration/human/person/PersonExplorationState";
import JurPersonExplorationState from "../../redux/types/exploration/jurPerson/JurPersonExplorationState";
import UserExplorationState from "../../redux/types/exploration/human/user/UserExplorationState";
import explorationStateManager from "../../service/exploration/stateManager/ExplorationStateManagerImpl";
import EntityExplorationParams from "../../redux/types/exploration/EntityExplorationParams";
import ExplorationMode from "../../redux/types/exploration/ExplorationMode";


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

                default: throw new Error("unknown api is in the state");
            }
        }
    })

    const explorationManager = useMemo<ExplorationStateManagerImpl<EntityExplorationState<any, any>>|undefined>(()=>{
       if (exploredEntity) {
           return explorationStateManager.getEntityManager(exploredEntity)
       }
    }, [exploredEntity])

    const explorationMode: ExplorationMode|null = explorationParams?ExplorationMode.getModeById(explorationParams.modeId):null;

    const explorationModes: ExplorationMode[]|null = explorationParams?explorationParams.supportedModesIdList.map(ExplorationMode.getModeById):null;

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>): void {
        const modeIndex = Number(event.currentTarget.value);

        const mode = explorationModes![modeIndex];

        if (mode) {
            explorationManager!.switchExplorationMode(mode);
            return;
        } else throw new Error("unknown mode");
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