import {PayloadAction} from "@reduxjs/toolkit";
import {Location} from "../../model/Location";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import Person, {Relationship} from "../../model/human/person/Person";
import User from "../../model/human/user/User";
import {RoleName} from "../userIdentity/Role";
import DateEntity, {DateBuilder} from "../../model/DateEntity";
import {Entity} from "../../model/Entity";

enum CreationCoreActions {
    SET_ENTITY_CREATION_PARAMS="SET_ENTITY_CREATION_PARAMS",
    UPDATE_ENTITY_CREATION_PARAMS="UPDATE_CREATION_PARAMS",
}

enum RelationType {
    PARENT="Батько/мати",
    SPOUSE="Чоловік/дружина",
    CHILD="Син/дочка",
    SIBLING="Брат/сестра",
    RELATIVE="Родич",
    FRIEND="Товариш"
}

export default CreationCoreActions;

export class PersonCreationParams implements Person {
    dateOfBirth = {...new DateBuilder().build()};
    firstName = "";
    lastName = "";
    middleName = "";
    relationships = [];
    sex = null;
    passportData = {passportSerial: "", passportNumber: "", rnokppCode: ""};
    location = null;
}

export class UserCreationParams implements User {
    email: string = "";
    firstName: string = "";
    lastName: string = "";
    middleName: string = "";
    password: string = "";
    role: RoleName = RoleName.USER;
}

export class JurPersonCreationParams implements JurPerson {
    benOwner: Person | null = null;
    dateOfRegistration: DateEntity = {...new DateBuilder().build()};
    edrpou: string = "";
    name: string = "";
    owner: Person | null = null;
    location: Location | null = null;

}

export type CreationParams = {
    selectedEntity: Entity,
    personCreationData: Person,
    jurPersonCreationData: JurPerson,
    userCreationData: User,
    pending: boolean
}
