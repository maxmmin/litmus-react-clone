import Form from "react-bootstrap/Form";
import React, {useMemo} from "react";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {useAppSelector} from "../../../redux/hooks";
import ExplorationStateManagerImpl from "../../../service/exploration/stateManager/ExplorationStateManagerImpl";
import store from "../../../redux/store";
import EntityExplorationState from "../../../redux/exploration/types/EntityExplorationState";
import HumanExplorationParams from "../../../redux/exploration/types/human/HumanExplorationParams";
import {Entity} from "../../../model/Entity";
import {Human} from "../../../model/human/Human";


const FindByFullNameGroup = () => {

    const exploredEntity = useAppSelector(state => state.exploration.exploredEntity);

    const stateManager: ExplorationStateManagerImpl<EntityExplorationState<Human, HumanExplorationParams>>|undefined = useMemo(()=>{
        if (exploredEntity) {
            switch (exploredEntity) {
                case Entity.USER: {
                    return ExplorationStateManagerImpl.getUserManager(store);
                }
                case Entity.PERSON: {
                    return ExplorationStateManagerImpl.getPersonManager(store);
                }
                default: throw new Error("unsupported entity")
            }
        }
    }, [exploredEntity])

    const explorationParams = useAppSelector(state => stateManager?.getExplorationParams());

    const {firstName, middleName, lastName} = explorationParams||{};

    if (!stateManager) return null;

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} value={lastName?lastName:""} onChange={e=>{
                    stateManager.updateParams({lastName: e.currentTarget.value})
                }} className={`last-name form-control`}  type="text" placeholder="Введіть прізвище"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} value={firstName?firstName:""}  onChange={e=>{
                    stateManager.updateParams({firstName: e.currentTarget.value})
                }} className={`first-name form-control`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} value={middleName?middleName:""}  onChange={e=>{
                    stateManager.updateParams({middleName: e.currentTarget.value})
                }} className={`middle-name form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByFullNameGroup;