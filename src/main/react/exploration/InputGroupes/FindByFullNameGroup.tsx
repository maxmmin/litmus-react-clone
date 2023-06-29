import Form from "react-bootstrap/Form";
import React, {useMemo} from "react";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {useAppSelector} from "../../../redux/hooks";
import HumanExplorationParams from "../../../redux/types/exploration/human/HumanExplorationParams";
import {Entity} from "../../../model/Entity";
import Human from "../../../model/human/Human";
import HumanExplorationStateManager from "../../../service/exploration/stateManager/HumanExplorationStateManager";
import UserExplorationStateManagerImpl
    from "../../../service/exploration/stateManager/user/UserExplorationStateManagerImpl";
import PersonExplorationStateManagerImpl
    from "../../../service/exploration/stateManager/person/PersonExplorationStateManagerImpl";
import {hasFullNameErrors} from "../../../service/exploration/validation/BasicExplorationValidationService";


const FindByFullNameGroup = () => {

    const exploredEntity = useAppSelector(state => state.exploration.exploredEntity);

    const stateManager: HumanExplorationStateManager<Human, HumanExplorationParams>|undefined = useMemo(()=>{
        if (exploredEntity) {
            switch (exploredEntity) {
                case Entity.USER: {
                    return new UserExplorationStateManagerImpl();
                }
                case Entity.PERSON: {
                    return new PersonExplorationStateManagerImpl();
                }
                default: throw new Error("unsupported entity")
            }
        }
    }, [exploredEntity])

    const explorationParams = useAppSelector(state => stateManager?.getExplorationParams());

    const {firstName, middleName, lastName} = explorationParams||{};

    const validationErrors = useAppSelector(state => stateManager?.getValidationErrors())!;

    if (!stateManager) return null;

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} value={lastName?lastName:""} onChange={e=>{
                    if (validationErrors.lastName) {
                        stateManager.updateValidationErrors({lastName: undefined})
                    }
                    stateManager.updateParams({lastName: e.currentTarget.value})
                }} className={`last-name form-control ${validationErrors.lastName?"is-invalid":""}`}  type="text" placeholder="Введіть прізвище"
                onKeyDown={keyPressHandler}
                />
                {validationErrors.lastName?<p className={"error-text error-text_input-tip"}>{validationErrors.lastName}</p>:null}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} value={firstName?firstName:""}  onChange={e=>{
                    if (validationErrors.firstName) {
                        stateManager.updateValidationErrors({firstName: undefined});
                    }
                    stateManager.updateParams({firstName: e.currentTarget.value})
                }} className={`first-name form-control ${validationErrors.firstName?"is-invalid":""}`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                />
                {validationErrors.firstName?<p className={"error-text error-text_input-tip"}>{validationErrors.firstName}</p>:null}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} value={middleName?middleName:""}  onChange={e=>{
                    if (validationErrors.middleName) {
                        stateManager.updateValidationErrors({middleName: undefined})
                    }
                    stateManager.updateParams({middleName: e.currentTarget.value})
                }} className={`middle-name form-control ${validationErrors.middleName?"is-invalid":""}`} type="text" placeholder="Введіть ім'я по-батькові"
                onKeyDown={keyPressHandler}
                />
                {validationErrors.middleName?<p className={"error-text error-text_input-tip"}>{validationErrors.middleName}</p>:null}
            </Form.Group>
        </>
    )
}

export default FindByFullNameGroup;