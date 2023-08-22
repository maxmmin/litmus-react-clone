import Header from "../header/Header";
import {Form} from "react-bootstrap";
import {Entity} from "../../model/Entity";
import PrivateComponentWrapper from "../authorization/PrivateComponentWrapper";
import {Permissions} from "../../redux/types/userIdentity/Role";
import {NO_OUTPUT} from "../authorization/PrivateComponent";
import React, {ChangeEvent, useEffect, useMemo} from "react";
import CreationInputSection from "./CreationInputSection";
import {
    getEntityByDomain,
} from "../../util/pureFunctions";
import {useLocation, useParams} from "react-router";
import {useNavigate} from "react-router-dom";
import store from "../../redux/store";
import {CreationModalModes} from "../../redux/types/creation/CreationModalModes";
import appConfig from "../../config/appConfig";
import {useAppSelector} from "../../redux/hooks";
import CreationStateManagerImpl from "../../service/creation/stateManager/CreationStateManagerImpl";
import CreationService from "../../service/creation/CreationService";
import getEntityCreationService from "../../util/getEntityCreationService";
import ServiceContext from "../serviceContext";
import {
    personDefaultValidationObject,
    PersonValidationObject
} from "../../service/creation/validation/human/person/PersonCreationValidationService";
import {
    jurPersonDefaultValidationObject,
    JurPersonValidationObject
} from "../../service/creation/validation/jurPerson/JurPersonCreationValidationService";
import {
    userDefaultValidationObject,
    UserValidationObject
} from "../../service/creation/validation/human/user/UserCreationValidationService";


export type CreationModalSettings = {
    mode: CreationModalModes
}   | null

const Creation = () => {
    const location = useLocation();

    const navigate = useNavigate();

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        navigate(event.currentTarget.value)
    }

    const {entityDomain}: {entityDomain?: string} = useParams<{entityDomain: string}>();

    const emergingEntity = useAppSelector(state => state.creation.selectedEntity);

    useEffect(() => {
        let urlEntity: Entity|null = null;

        if (entityDomain) {
            urlEntity = getEntityByDomain(entityDomain)
        }

        if (!urlEntity) {
            if (emergingEntity) {
                navigate(appConfig.applicationMappings.creation[emergingEntity])
            } else navigate(appConfig.applicationMappings.creation.default);
        } else if (urlEntity!==emergingEntity) {
            CreationStateManagerImpl.switchEntity(urlEntity, store.dispatch);
        }
    }, [location])

    const hasScreenErrors = useAppSelector(state => {
        if (!emergingEntity) return true;
        switch (emergingEntity) {
            case Entity.PERSON: {
                const validationErrors: PersonValidationObject = state.creation.person?state.creation.person.validationErrors:personDefaultValidationObject;
                return ServiceContext.creation.validation.person.hasErrors(validationErrors)
            }
            case Entity.JUR_PERSON: {
                const validationErrors: JurPersonValidationObject = state.creation.jurPerson?state.creation.jurPerson.validationErrors:jurPersonDefaultValidationObject;
                return ServiceContext.creation.validation.jurPerson.hasErrors(validationErrors);
            }
            case Entity.USER: {
                const validationErrors: UserValidationObject = state.creation.user?state.creation.user.validationErrors:userDefaultValidationObject;
                return ServiceContext.creation.validation.user.hasErrors(validationErrors);
            }
            default: throw new Error("unknown entity")
        }
    })

    if (!emergingEntity) return null;

    const creationService: CreationService = getEntityCreationService(emergingEntity);

    return (
        <div className="creation-page">
            <main className={"creation-page__main-container"}>
               <div className="creation-page__create">
                       <div className="creation-page__create-select-wrapper">
                           <p style={{marginBottom: '10px'}}>Створити</p>
                           <Form.Select className={"create__select"} value={appConfig.applicationMappings.creation[emergingEntity]} onChange={handleSelectChange}>
                               <option value={appConfig.applicationMappings.creation[Entity.PERSON]}>Фізичну особу</option>
                               <option value={appConfig.applicationMappings.creation[Entity.JUR_PERSON]}>Юридичну особу</option>
                               <PrivateComponentWrapper requiredPermissions={[Permissions.USERS_WRITE]} mode={NO_OUTPUT}>
                                   <option value={appConfig.applicationMappings.creation[Entity.USER]}>Користувача</option>
                               </PrivateComponentWrapper>
                           </Form.Select>
                       </div>

                   <Form onSubmit={e=>{
                       e.preventDefault();
                       creationService.createEntity();
                   }} className={"creation-input-group"}>
                       <CreationInputSection entity={emergingEntity}/>

                       <button disabled={hasScreenErrors} type={"submit"} className="creation-input-group__btn btn btn-primary">Створити</button>
                   </Form>
               </div>
            </main>
        </div>
    )
}

export default Creation;