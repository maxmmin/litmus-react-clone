import Form from "react-bootstrap/Form";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import React, {useContext, useEffect} from "react";
import UserCreationStateManager from "../../../service/creation/stateManager/user/UserCreationStateManager";
import {useAppSelector} from "../../../redux/hooks";
import InputError from "../../sharedComponents/InputError";
import {LitmusServiceContext} from "../../App";
import UserCreationValidationService
    from "../../../service/creation/validation/human/user/UserCreationValidationService";


const CreateUser = () => {
    const context = useContext(LitmusServiceContext);
    const user = useAppSelector(state => state.creation.user?.emergingEntity)!

    const creationStateManager: UserCreationStateManager = context.creation.stateManagers.user;
    const validationService: UserCreationValidationService = context.creation.validation.user;

    const validationErrors = useAppSelector(state => state.creation.user?.validationErrors);

    useEffect(()=>{
        const updatedFullNameErrors = validationService.validateFullName(user);

        if (validationErrors?.middleName&&!updatedFullNameErrors?.middleName) {
            creationStateManager.updateValidationErrors({middleName: null})
        }

        if (validationErrors?.lastName&&!updatedFullNameErrors.lastName) {
            creationStateManager.updateValidationErrors({lastName: null})
        }

        if (validationErrors?.firstName&&!updatedFullNameErrors.firstName) {
            creationStateManager.updateValidationErrors({firstName: null})
        }
    }, [user.firstName, user.middleName, user.lastName])

    return (
        <>
            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Email адреса</Form.Label>
                <input autoComplete={"new-password"} className={`email form-control ${validationErrors?.email?'is-invalid':''}`} type="text" placeholder="Введіть EMAIL"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({email: e.currentTarget.value});
                       }}
                />
                <InputError error={validationErrors?.email}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} className={`lastName form-control ${validationErrors?.lastName?'is-invalid':''}`}  type="text" placeholder="Введіть прізвище"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({lastName: e.currentTarget.value});
                       }}
                />
                <InputError error={validationErrors?.lastName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} className={`firstName form-control ${validationErrors?.firstName?'is-invalid':''}`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({firstName: e.currentTarget.value});
                       }}
                />
                <InputError error={validationErrors?.firstName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} className={`middleName form-control ${validationErrors?.middleName?'is-invalid':''}`} type="text" placeholder="Введіть ім'я по-батькові"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({middleName: e.currentTarget.value});
                       }}
                />
                <InputError error={validationErrors?.middleName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Пароль</Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control ${validationErrors?.password?'is-invalid':''}`} type="password" placeholder="Введіть пароль"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({password: e.currentTarget.value});
                       }}
                />
                <InputError error={validationErrors?.password}/>
            </Form.Group>
            {/* @todo 06.07!! create local variable of repeat password and check it before call onSubmit(or just set error to password validation field if passwords dont match */}
            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Повторіть пароль</Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control`} type="password" placeholder="Повторіть пароль"
                       onKeyDown={keyPressHandler}
                       onChange={(e)=>creationStateManager.updateEntityCreationParams({
                           repeatPassword: e.currentTarget.value
                       })}
                />
            </Form.Group>
        </>
    )
}

export default CreateUser;