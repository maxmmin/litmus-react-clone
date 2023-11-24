import React, {Ref, useEffect, useMemo, useRef, useState} from "react";
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

type UserProps = {
    user: User
}

const createdEntitiesPageSize = 5;

export default function ({user}: UserProps) {

    const usersPager: Ref<LocalPager<User>> = useRef<LocalPager<User>>(new LocalPager<User>(user.createdEntities.users, createdEntitiesPageSize));
    const personsPager: Ref<LocalPager<Person>> = useRef<LocalPager<Person>>(new LocalPager<Person>(user.createdEntities.persons, createdEntitiesPageSize));
    const jurPersonsPager: Ref<LocalPager<JurPerson>> = useRef<LocalPager<JurPerson>>(new LocalPager<JurPerson>(user.createdEntities.jurPersons, createdEntitiesPageSize));

    const [usersPage, setUsersPage] = useState<PagedData<User>|null>(null);
    const [personsPage, setPersonsPage] = useState<PagedData<Person>|null>(null);
    const [jurPersonsPage, setJurPersonsPage] = useState<PagedData<JurPerson>|null>(null);

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

    if (!usersPage||!personsPage||!jurPersonsPage) return <Loader/>

    console.log(user.createdEntities)
    console.log(personsPager.current)

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_user"}>
            <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_user">
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
                        {!usersPage.empty && <EntitiesPaginator page={usersPage} pager={usersPager.current!}/>}
                    </div>

                    {usersPage.empty
                        ?
                        <p className={"created-entities__no-entities-label"}>Створених існуючих користувачів не знайдено</p>
                        :
                        usersPage.content.map(user=><UserInfoTable key={user.email} user={user}/>)}
                </section>
                <section className="user-page__created-entities user-page__created-entities_persons">
                    <div className="created-entities__heading-container">
                        <h4 className={"created-entities__heading-title"}>Створені особи</h4>
                        {!personsPage.empty && <EntitiesPaginator page={personsPage} pager={personsPager.current!}/>}
                    </div>

                    {personsPage.empty
                        ?
                        <p className={"created-entities__no-entities-label"}>Створених існуючих осіб не знайдено</p>
                        :
                        personsPage.content.map(person=><PersonInfoTable key={person.id} person={person}/>)
                    }
                </section>
                <section className="user-page__created-entities user-page__created-entities_jur-persons">
                    <div className="created-entities__heading-container">
                        <h4 className={"created-entities__heading-title"}>Створені юридичні особи</h4>
                        {!jurPersonsPage.empty && <EntitiesPaginator page={jurPersonsPage} pager={jurPersonsPager.current!}/>}
                    </div>

                    {jurPersonsPage.empty
                        ?
                        <p className={"created-entities__no-entities-label"}>Створених існуючих юридичних осіб не знайдено</p>
                        :
                        jurPersonsPage.content.map(jurPerson=><JurPersonInfoTable jurPerson={jurPerson}/>)}
                </section>
            </section>

        </div>
    )
}