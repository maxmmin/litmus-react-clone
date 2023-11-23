import React from "react";
import User from "../../../model/human/user/User";

type UserProps = {
    user: User
}

export default function ({user}: UserProps) {
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

                <div className="user-page__created-entities">
                    <div className="user-page__created-users">

                    </div>
                    <div className="user-page__created-persons">

                    </div>
                    <div className="user-page__created-jur-persons">

                    </div>
                </div>
            </section>
        </div>
    )
}