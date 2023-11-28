import Form from "react-bootstrap/Form";
import React, {useMemo} from "react";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {useAppSelector} from "../../../redux/hooks";
import HumanExplorationParams from "../../../redux/types/exploration/human/HumanExplorationParams";
import Human from "../../../model/human/Human";
import HumanExplorationStateManager from "../../../service/stateManagers/exploration/HumanExplorationStateManager";
import {getEntityExplorationStateManager} from "../../../util/getEntityExplorationService";


const FindByFullNameGroup = () => {

    const exploredEntity = useAppSelector(state => state.exploration.exploredEntity);

    const stateManager: HumanExplorationStateManager<Human, HumanExplorationParams>|undefined = useMemo(()=>{
        if (exploredEntity) {
            return getEntityExplorationStateManager(exploredEntity) as HumanExplorationStateManager<Human, HumanExplorationParams>;
        };
    }, [exploredEntity])

    const explorationParams = useAppSelector(state => stateManager?.getExplorationParams());

    const {firstName, middleName, lastName} = explorationParams||{};

    if (!stateManager) return null;

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Прізвище</Form.Label>
                <input required={true} autoComplete={"new-password"} value={lastName} onChange={e=>{
                    stateManager.updateParams({lastName: e.currentTarget.value})
                }} className={`last-name form-control`}  type="text" placeholder="Введіть прізвище"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} value={firstName}  onChange={e=>{
                    stateManager.updateParams({firstName: e.currentTarget.value})
                }} className={`first-name form-control`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} value={middleName}  onChange={e=>{
                    stateManager.updateParams({middleName: e.currentTarget.value})
                }} className={`middle-name form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByFullNameGroup;