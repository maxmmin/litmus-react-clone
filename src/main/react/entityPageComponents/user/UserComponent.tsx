import "../../assets/styles/entityPage/entityPage.scss";

import React, {Ref, useContext, useMemo, useRef, useState} from "react";
import User from "../../../model/human/user/User";
import PagedData from "../../../rest/PagedData";
import Person from "../../../model/human/person/Person";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import Loader from "../../loader/Loader";
import {EntitiesPaginator, LocalPager} from "../../../util/pageDataUtils";
import "../../assets/styles/entityPage/userPage.scss"
import {ServiceContext} from "../../../serviceContext";
import {LitmusServiceContext} from "../../App";
import ManagePanel from "../manage/ManagePanel";
import UserApiService from "../../../service/api/user/UserApiService";
import {useLocation} from "react-router";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../../../redux/hooks";
import {checkNotEmpty} from "../../../util/pureFunctions";
import {UserAction} from "../../../service/userHierarchy/HierarchyPermissionChecker";
import {Permission} from "../../../model/userIdentity/Role";
import appConfig from "../../../config/appConfig";
import {ApplicationError} from "../../../rest/ErrorResponse";
import {HttpErrorParser} from "../../../error/BasicHttpError";
import {JurPersonNavLink, PersonNavLink, UserNavLink} from "../../../util/navLinkBuilders";

type UserProps = {
    user: User
}

const createdEntitiesPageSize = 5;

export default function ({user}: UserProps) {
    const [isPending, setPending] = useState<boolean>(false);

    const serviceContext: ServiceContext = useContext(LitmusServiceContext);

    const notificationManager = serviceContext.notification.manager;

    const explorationStateManager = serviceContext.exploration.stateManagers.user;
    const explorationService = serviceContext.exploration.service.user;

    const apiService: UserApiService = serviceContext.api.user;

    const location = useLocation();
    const navigate = useNavigate();

    const hierarchyPermissionsChecker = serviceContext.hierarchyPermissionsChecker;

    const [usersIndex, setUsersIndex] = useState(0);
    const [personsIndex, setPersonsIndex] = useState(0);
    const [jurPersonsIndex, setJurPersonsIndex] = useState(0);

    const usersPager: Ref<LocalPager<User>> = useRef<LocalPager<User>>(new LocalPager<User>(user.createdEntities.users,
        {pageSize: createdEntitiesPageSize, pageIndex: usersIndex}));
    const personsPager: Ref<LocalPager<Person>> = useRef<LocalPager<Person>>(new LocalPager<Person>(user.createdEntities.persons,
        {pageSize: createdEntitiesPageSize, pageIndex: personsIndex}
    ));
    const jurPersonsPager: Ref<LocalPager<JurPerson>> = useRef<LocalPager<JurPerson>>(new LocalPager<JurPerson>(user.createdEntities.jurPersons,
        {pageSize: createdEntitiesPageSize, pageIndex: jurPersonsIndex}
    ));

    const usersPage: PagedData<User>|null = useMemo(()=>{
        if (usersPager.current) {
            usersPager.current.goTo(usersIndex);
            return usersPager.current.getPageData();
        } else return null;
    }, [usersPager.current, usersIndex])

    const personsPage: PagedData<Person>|null = useMemo(()=>{
        if (personsPager.current) {
            personsPager.current.goTo(personsIndex)
            return personsPager.current.getPageData();
        } else return null;
    }, [personsPager.current, personsIndex])

    const jurPersonsPage: PagedData<JurPerson>|null = useMemo(()=>{
        if (jurPersonsPager.current) {
            jurPersonsPager.current.goTo(jurPersonsIndex)
            return jurPersonsPager.current.getPageData()
        } else return null;
    }, [jurPersonsPager.current, jurPersonsIndex])

    const currentUser = useAppSelector(state => checkNotEmpty(state.userIdentity));

    if (isPending||!usersPage||!personsPage||!jurPersonsPage) return <Loader/>

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_user"}>

            <div className="entity-page-inner-wrapper">
                <h2>{currentUser.email !== user.email ? "Сторінка користувача" : "Мій профіль"}</h2>

                <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_user">
                    <ManagePanel removalProps={{
                        title: `Щоб підтвердити видалення, введіть email користувача("${user.email}").`,
                        match: (s)=>s===user.email,
                        hide: !hierarchyPermissionsChecker.isPermittedByRole(currentUser.role, user.role, UserAction.DELETE),
                        removalPermissions: [Permission.USERS_REMOVE],
                        onSubmit: async ()=>{
                            setPending(true);
                            try {
                                await apiService.remove(user.id);
                                notificationManager.success("Особу було успішно видалено");

                                if (location.key !== "default") navigate(-1);
                                else navigate(appConfig.applicationMappings.root);

                                const loadedUsers = explorationStateManager.getExplorationData()?.response.content;
                                if (loadedUsers) {
                                    const content = explorationStateManager.getExplorationData()?.response.content;
                                    if (content) {
                                        if (content.findIndex(p=>p.id===user.id)>-1) {
                                            await explorationService.explore();
                                        }
                                    }
                                }
                            } catch (e: unknown) {
                                console.error(e);
                                const processedErr: ApplicationError = HttpErrorParser.parseError(e);
                                notificationManager.error(HttpErrorParser.getErrorDescription(processedErr));
                            } finally {
                                setPending(false);
                            }
                        }
                    }}/>

                    <div className="main-entity-section__main-entity-info-container main-entity-section__main-entity-info-container_user">
                        <p className={"main-entity-info-container__item main-entity-info-container__item_user"}>
                            <span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>
                                ID:
                            </span> {user.id}
                        </p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_user"}>
                            <span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>
                                Email:
                            </span> {user.email}
                        </p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_user"}>
                            <span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>
                                Прізвище:
                            </span> {user.lastName}
                        </p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_user"}>
                            <span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>
                                Ім'я:
                            </span> {user.firstName}
                        </p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_user"}>
                            <span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>
                                По-батькові:
                            </span> {user.middleName}
                        </p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_user"}>
                            <span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>
                                Роль:
                            </span> {user.role.canonicalName}
                        </p>
                    </div>
                </section>

                <section className="user-page__created-entities-section">
                    <section className="user-page__created-entities user-page__created-entities_users">
                        <div className="created-entities__heading-container">
                            <h4 className={"created-entities__heading-title"}>Створені користувачі</h4>
                            {!usersPage.empty && <EntitiesPaginator page={usersPage} goTo={(i)=>setUsersIndex(i)}/>}
                        </div>

                        {usersPage.empty
                            ?
                            <p className={"created-entities__no-entities-label"}>Створених існуючих користувачів не знайдено</p>
                            :
                            <ul className={"created-entities_link-list"}>
                                {usersPage.content.map(user=><li key={user.id}><UserNavLink user={user}/></li>)}
                            </ul>
                        }
                    </section>
                    <section className="user-page__created-entities user-page__created-entities_persons">
                        <div className="created-entities__heading-container">
                            <h4 className={"created-entities__heading-title"}>Створені особи</h4>
                            {!personsPage.empty && <EntitiesPaginator page={personsPage} goTo={(i: number)=>setPersonsIndex(i)}/>}
                        </div>

                        {personsPage.empty
                            ?
                            <p className={"created-entities__no-entities-label"}>Створених існуючих осіб не знайдено</p>
                            :
                            <ul className={"created-entities_link-list"}>
                                {personsPage.content.map(person=><li key={person.id}><PersonNavLink person={person}/></li>)}
                            </ul>
                        }
                    </section>
                    <section className="user-page__created-entities user-page__created-entities_jur-persons">
                        <div className="created-entities__heading-container">
                            <h4 className={"created-entities__heading-title"}>Створені юридичні особи</h4>
                            {!jurPersonsPage.empty && <EntitiesPaginator goTo={(i: number)=>setJurPersonsIndex(i)} page={jurPersonsPage}/>}
                        </div>

                        {jurPersonsPage.empty
                            ?
                            <p className={"created-entities__no-entities-label"}>Створених існуючих юридичних осіб не знайдено</p>
                            :
                            jurPersonsPage.content.map(jurPerson=><li key={jurPerson.id}><JurPersonNavLink jurPerson={jurPerson}/></li>)}
                    </section>
                </section>
            </div>

        </div>
    )
}