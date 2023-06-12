import Form from "react-bootstrap/Form";
import React, {useMemo} from "react";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {useAppSelector} from "../../../redux/hooks";
import ExplorationStateManager from "../../../service/exploration/ExplorationStateManager";
import store from "../../../redux/store";
import EntityExplorationState from "../../../redux/exploration/types/EntityExplorationState";
import HumanExplorationParams from "../../../redux/exploration/types/human/HumanExplorationParams";
import {Entity} from "../../../model/Entity";
import {Human} from "../../../model/human/Human";


const FindByFullNameGroup = () => {

    const exploredEntity = useAppSelector(state => state.exploration.exploredEntity);

    const stateManager: ExplorationStateManager<EntityExplorationState<Human, HumanExplorationParams>>|undefined = useMemo(()=>{
        if (exploredEntity) {
            switch (exploredEntity) {
                case Entity.USER: {
                    return ExplorationStateManager.getUserManager(store);
                }
                case Entity.PERSON: {
                    return ExplorationStateManager.getPersonManager(store);
                }
                default: throw new Error("unsupported entity")
            }
        }
    }, [exploredEntity])

    const explorationParams = useAppSelector(state => {
        switch (exploredEntity) {
            case Entity.USER: {
                return state.exploration.user?.params!;
            }
            case Entity.PERSON: {
                return state.exploration.person?.params!;
            }
            default: throw new Error("unsupported entity")
        }
    });

    const {firstName, middleName, lastName} = explorationParams;

    if (!stateManager) return null;

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} value={lastName?lastName:""} onChange={e=>{
                    stateManager!.setParams({...explorationParams, lastName: e.currentTarget.value})
                }} className={`last-name form-control`}  type="text" placeholder="Введіть прізвище"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} value={firstName?firstName:""}  onChange={e=>{
                    stateManager!.setParams({...explorationParams, firstName: e.currentTarget.value})
                }} className={`first-name form-control`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} value={middleName?middleName:""}  onChange={e=>{
                    stateManager!.setParams({...explorationParams, middleName: e.currentTarget.value})
                }} className={`middle-name form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByFullNameGroup;