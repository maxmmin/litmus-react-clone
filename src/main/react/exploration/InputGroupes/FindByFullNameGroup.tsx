import Form from "react-bootstrap/Form";
import React, {useMemo} from "react";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {useAppSelector} from "../../../redux/hooks";
import ExplorationStateManager from "../../../redux/exploration/ExplorationStateManager";
import {
    BasicHumanExplorationParamsGroup, Entity,
    EntityExplorationState
} from "../../../redux/exploration/EntityExplorationState";
import store from "../../../redux/store";


const FindByFullNameGroup = () => {

    const exploredEntity = useAppSelector(state => state.exploration.exploredEntity);

    const stateManager: ExplorationStateManager<EntityExplorationState<any, BasicHumanExplorationParamsGroup>>|undefined = useMemo(()=>{
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

    if (!stateManager) return null;

    const {lastName, middleName, firstName} = stateManager.getExplorationParams();


    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} value={lastName?lastName:""} onChange={e=>{
                    const prev = stateManager!.getExplorationParams();
                    stateManager!.updateParams({...prev, lastName: e.currentTarget.value})
                }} className={`last-name form-control`}  type="text" placeholder="Введіть прізвище"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} value={firstName?firstName:""}  onChange={e=>{
                    const prev = stateManager!.getExplorationParams();
                    stateManager!.updateParams({...prev, firstName: e.currentTarget.value})
                }} className={`first-name form-control`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} value={middleName?middleName:""}  onChange={e=>{
                    const prev = stateManager!.getExplorationParams();
                    stateManager!.updateParams({...prev, middleName: e.currentTarget.value})
                }} className={`middle-name form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByFullNameGroup;