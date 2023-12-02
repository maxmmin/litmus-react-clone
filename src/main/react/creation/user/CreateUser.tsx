import Form from "react-bootstrap/Form";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import React, {useContext, useMemo, useState} from "react";
import UserCreationStateManager from "../../../service/stateManagers/creation/user/UserCreationStateManager";
import {useAppSelector} from "../../../redux/hooks";
import InputError from "../../sharedComponents/InputError";
import {LitmusServiceContext} from "../../App";
import UserCreationValidationService from "../../../service/validation/human/user/UserCreationValidationService";
import {VisibilityDisabledIcon, VisibilityEnabledIcon} from "../../assets/icons";
import Role from "../../../model/userIdentity/Role";
import ApplicationResourcesStateManager
    from "../../../service/stateManagers/applicationResources/ApplicationResourcesStateManager";
import {UserAction} from "../../../service/userHierarchy/HierarchyPermissionChecker";


const CreateUser = () => {
    const context = useContext(LitmusServiceContext);
    const user = useAppSelector(state => state.creation.user?.emergingEntity)!

    const creationStateManager: UserCreationStateManager = context.creation.stateManagers.user;
    const validationService: UserCreationValidationService = context.creation.validation.user;
    const validationErrors = useAppSelector(state => state.creation.user?.validationErrors);
    const applicationResourcesStateManager: ApplicationResourcesStateManager = context.applicationResources.stateManager;

    const permissionsChecker = context.hierarchyPermissionsChecker;

    const userIdentity = useAppSelector(state => state.userIdentity!);

    const roles = applicationResourcesStateManager.getRoles();

    const creationAvailableRoles: Role[] = useMemo(()=>{
        const clientRole = userIdentity.role;
        return Object.values(applicationResourcesStateManager.getRoles()!)
            .filter(role=>permissionsChecker.isPermittedByRole(clientRole, role, UserAction.CREATE))
    }, [roles, permissionsChecker, applicationResourcesStateManager, userIdentity.role])

    function checkExistingRepeatPwdValidityErr () {
        if (validationErrors?.repeatPassword) {
            const updatedPwdErr = validationService.isPasswordConfirmed(creationStateManager.getCreationParams());
            if (!updatedPwdErr) {
                creationStateManager.updateValidationErrors({repeatPassword: null})
            } else if (updatedPwdErr !== validationErrors.repeatPassword) creationStateManager.updateValidationErrors({repeatPassword: updatedPwdErr})
        }
    }

    const [passwordsVisibility, setPasswordsVisibility] = useState<{password: boolean, repeatPassword: boolean}>({
        password: false,
        repeatPassword: false
    })

    return (
        <>
            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Email адреса</Form.Label>
                <input autoComplete={"new-password"}
                       className={`email form-control ${validationErrors?.email?'is-invalid':''}`}
                       type="text" placeholder="Введіть EMAIL"
                       value={user.email}
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({email: e.currentTarget.value});

                           if (validationErrors?.email) {
                               const updatedEmailErr = validationService.validateEmail(creationStateManager.getCreationParams().email);
                               if (!updatedEmailErr) {
                                   creationStateManager.updateValidationErrors({email: null})
                               } else if (updatedEmailErr !== validationErrors.email) creationStateManager.updateValidationErrors({email: updatedEmailErr})
                           }
                       }}
                />
                <InputError error={validationErrors?.email}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} className={`lastName form-control ${validationErrors?.lastName?'is-invalid':''}`}  type="text" placeholder="Введіть прізвище"
                       onKeyDown={keyPressHandler}
                       value={user.lastName}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({lastName: e.currentTarget.value});
                           const updatedFullNameErrors = validationService.validateFullName(creationStateManager.getCreationParams());

                           if (validationErrors?.lastName) {
                               if (!updatedFullNameErrors.lastName) {
                                   creationStateManager.updateValidationErrors({lastName: null})
                               } else if (updatedFullNameErrors.lastName !== validationErrors.lastName) creationStateManager.updateValidationErrors({lastName: updatedFullNameErrors.lastName});
                           }
                       }}
                />
                <InputError error={validationErrors?.lastName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} className={`firstName form-control ${validationErrors?.firstName?'is-invalid':''}`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                       value={user.firstName}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({firstName: e.currentTarget.value});

                           const updatedFullNameErrors = validationService.validateFullName(creationStateManager.getCreationParams());

                           if (validationErrors?.firstName) {
                               if (!updatedFullNameErrors.firstName) {
                                   creationStateManager.updateValidationErrors({firstName: null})
                               } else if (updatedFullNameErrors.firstName !== validationErrors.firstName) creationStateManager.updateValidationErrors({firstName: updatedFullNameErrors.firstName})
                           }
                       }}
                />
                <InputError error={validationErrors?.firstName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} className={`middleName form-control ${validationErrors?.middleName?'is-invalid':''}`} type="text" placeholder="Введіть ім'я по-батькові"
                       onKeyDown={keyPressHandler}
                       value={user.middleName}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({middleName: e.currentTarget.value});

                           const updatedFullNameErrors = validationService.validateFullName(creationStateManager.getCreationParams());

                           if (validationErrors?.middleName) {
                               if (!updatedFullNameErrors?.middleName) {
                                   creationStateManager.updateValidationErrors({middleName: null})
                               } else if (updatedFullNameErrors.middleName !== validationErrors.middleName) creationStateManager.updateValidationErrors({middleName: updatedFullNameErrors.middleName})
                           }
                       }}
                />
                <InputError error={validationErrors?.middleName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Пароль <span className={"password__visibility"} onClick={()=>{
                    setPasswordsVisibility(prev=>({...prev, password: !prev.password}))
                    }}>
                        {passwordsVisibility.password?
                            <VisibilityEnabledIcon className={"password__visibility-icon password__visibility-icon_enabled"} color={"darkgrey"}/>
                            :
                            <VisibilityDisabledIcon className={"password__visibility-icon password__visibility-icon_disabled"} color={"darkgrey"}/>
                            }
                    </span>
                </Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control ${validationErrors?.password?'is-invalid':''}`}
                       type={passwordsVisibility.password?"text":"password"} placeholder="Введіть пароль"
                       onKeyDown={keyPressHandler}
                       value={user.password}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({password: e.currentTarget.value});

                           if (validationErrors?.password) {
                               const updatedPwdErr = validationService.validatePassword(creationStateManager.getCreationParams().password);
                               if (!updatedPwdErr) {
                                   creationStateManager.updateValidationErrors({password: null})
                               } else if (updatedPwdErr !== validationErrors.password) creationStateManager.updateValidationErrors({password: updatedPwdErr})
                           } else checkExistingRepeatPwdValidityErr()
                       }}
                />
                <InputError error={validationErrors?.password}/>
            </Form.Group>
            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>
                    Повторіть пароль <span className={"password__visibility"} onClick={()=>{
                        setPasswordsVisibility(prev=>({...prev, repeatPassword: !prev.repeatPassword}))
                    }}>
                        {passwordsVisibility.repeatPassword?
                            <VisibilityEnabledIcon className={"password__visibility-icon password__visibility-icon_enabled"} color={"darkgrey"}/>
                            :
                            <VisibilityDisabledIcon className={"password__visibility-icon password__visibility-icon_disabled"} color={"darkgrey"}/>
                        }
                    </span>
                </Form.Label>
                <input autoComplete={"new-password"}
                       className={`passport-number form-control ${validationErrors?.repeatPassword?'is-invalid':''}`}
                       type={passwordsVisibility.repeatPassword?"text":"password"}
                       placeholder="Повторіть пароль"
                       onKeyDown={keyPressHandler}
                       value={user.repeatPassword}
                       onChange={(e)=>{
                           creationStateManager.updateEntityCreationParams({
                               repeatPassword: e.currentTarget.value
                           })

                           checkExistingRepeatPwdValidityErr()
                       }}
                />
                <InputError error={validationErrors?.repeatPassword}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Роль</Form.Label>
                <Form.Select className="explore__select" value={user.role} onChange={e=>{
                    const roleName = e.currentTarget.value;
                    if (!roleName) throw new Error("unknown role");
                    creationStateManager.updateEntityCreationParams({role: roleName})
                }}>
                    {creationAvailableRoles.map((role, index)=>
                        <option key={index} value={role.name}>{role.canonicalName}</option>)
                    }
                </Form.Select>
            </Form.Group>
        </>
    )
}

export default CreateUser;