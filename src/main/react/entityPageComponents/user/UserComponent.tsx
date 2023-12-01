import React, {Ref, useContext, useEffect, useRef, useState} from "react";
import User from "../../../model/human/user/User";
import PagedData from "../../../rest/PagedData";
import Person from "../../../model/human/person/Person";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import Loader from "../../loader/Loader";
import UserInfoTable from "../../exploration/EntityTables/UserInfoTable";
import {EntitiesPaginator, LocalPager} from "../../../util/pageDataUtils";
import PersonInfoTable from "../../exploration/EntityTables/PersonInfoTable";
import JurPersonInfoTable from "../../exploration/EntityTables/JurPersonInfoTable";
import "../../assets/styles/entityPage/userPage.scss"
import {ServiceContext} from "../../serviceContext";
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

    const [dirtyCheckMonitor, setDirtyCheckMonitor] = useState<object>({})

    const refresh = () => setDirtyCheckMonitor({})

    const usersPager: Ref<LocalPager<User>> = useRef<LocalPager<User>>(new LocalPager<User>(user.createdEntities.users,
        {pageSize: createdEntitiesPageSize, pageIndex: 0}));
    const personsPager: Ref<LocalPager<Person>> = useRef<LocalPager<Person>>(new LocalPager<Person>(user.createdEntities.persons,
        {pageSize: createdEntitiesPageSize, pageIndex: 0}
    ));
    const jurPersonsPager: Ref<LocalPager<JurPerson>> = useRef<LocalPager<JurPerson>>(new LocalPager<JurPerson>(user.createdEntities.jurPersons,
        {pageSize: createdEntitiesPageSize, pageIndex: 0}
    ));

    const [usersPage, setUsersPage] = useState<PagedData<User>|null>(null);
    const [personsPage, setPersonsPage] = useState<PagedData<Person>|null>(null);
    const [jurPersonsPage, setJurPersonsPage] = useState<PagedData<JurPerson>|null>(null);

    const hierarchyPermissionsChecker = serviceContext.hierarchyPermissionsChecker;

    useEffect(()=>{
        if (usersPager.current) {
            setUsersPage(usersPager.current.getPageData())
        }
    }, [usersPager.current?.getPageData()])

    useEffect(()=>{
        if (personsPager.current) {
            setPersonsPage(personsPager.current.getPageData())
        }
    }, [personsPager.current?.getPageData()])

    useEffect(()=>{
        if (jurPersonsPager.current) {
            setJurPersonsPage(jurPersonsPager.current.getPageData())
        }
    }, [jurPersonsPager.current?.getPageData()])

    const currentUser = useAppSelector(state => checkNotEmpty(state.userIdentity));

    if (isPending||!usersPage||!personsPage||!jurPersonsPage) return <Loader/>

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_user"}>

            <div className="entity-page-inner-wrapper">
                <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_user">
                    <ManagePanel removalProps={{
                        title: `Щоб підтвердити видалення, введіть email користувача("${user.email}").`,
                        match: (s)=>s===user.lastName,
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

                    <div className="main-entity-section__main-entity-info-container">
                        <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Email:</span> {user.email}</p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Прізвище:</span> {user.lastName}</p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Ім'я:</span> {user.firstName}</p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>По-батькові:</span> {user.middleName}</p>
                        <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Роль:</span> {user.role.canonicalName}</p>
                    </div>
                </section>

                <section className="user-page__created-entities-section">
                    <section className="user-page__created-entities user-page__created-entities_users">
                        <div className="created-entities__heading-container">
                            <h4 className={"created-entities__heading-title"}>Створені користувачі</h4>
                            {!usersPage.empty && <EntitiesPaginator refresh={refresh} page={usersPage} pager={usersPager.current!}/>}
                        </div>

                        {usersPage.empty
                            ?
                            <p className={"created-entities__no-entities-label"}>Створених існуючих користувачів не знайдено</p>
                            :
                            usersPage.content.map(user=><><UserNavLink key={user.email} user={user}/><br/></>)}
                    </section>
                    <section className="user-page__created-entities user-page__created-entities_persons">
                        <div className="created-entities__heading-container">
                            <h4 className={"created-entities__heading-title"}>Створені особи</h4>
                            {!personsPage.empty && <EntitiesPaginator refresh={refresh} page={personsPage} pager={personsPager.current!}/>}
                        </div>

                        {personsPage.empty
                            ?
                            <p className={"created-entities__no-entities-label"}>Створених існуючих осіб не знайдено</p>
                            :
                            personsPage.content.map(person=><><PersonNavLink person={person} key={person.id}/><br/></>)
                        }
                    </section>
                    <section className="user-page__created-entities user-page__created-entities_jur-persons">
                        <div className="created-entities__heading-container">
                            <h4 className={"created-entities__heading-title"}>Створені юридичні особи</h4>
                            {!jurPersonsPage.empty && <EntitiesPaginator refresh={refresh} page={jurPersonsPage} pager={jurPersonsPager.current!}/>}
                        </div>

                        {jurPersonsPage.empty
                            ?
                            <p className={"created-entities__no-entities-label"}>Створених існуючих юридичних осіб не знайдено</p>
                            :
                            jurPersonsPage.content.map(jurPerson=><><JurPersonNavLink key={jurPerson.id} jurPerson={jurPerson}/><br/></>)}
                    </section>
                </section>
            </div>

        </div>
    )
}