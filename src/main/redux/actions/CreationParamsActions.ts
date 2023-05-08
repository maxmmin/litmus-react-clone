import {Tables} from "../../types/explorationParams";
import {PayloadAction} from "@reduxjs/toolkit";
import {Location} from "../../types/Location";
import {JurPerson} from "../../types/JurPerson";
import Person, {Relationship, RelationshipsLinkObject} from "../../types/Person";
import User from "../../types/User";
import {PassportData} from "../../types/PassportData";
import {Roles} from "../../types/Role";
import DateEntity, {DateBuilder} from "../../types/DateEntity";
import Sex from "../../types/Sex";

enum CreationParamsActions {
    /**
     * general actions
     */
    SET_CREATION_PARAMS="SET_CREATION_PARAMS",
    UPDATE_CREATION_PARAMS="UPDATE_CREATION_PARAMS",
    SET_CREATION_PENDING="SET_CREATION_PENDING",
    /**
     * jur person creation actions
     */
    UPDATE_JUR_PERSON_CREATION_DATA="UPDATE_JUR_PERSON_CREATION_DATA",
    /**
     * person creation actions
     */
    UPDATE_PERSON_CREATION_DATA="UPDATE_PERSON_CREATION_DATA",
    UPDATE_PASSPORT_DATA="UPDATE_PASSPORT_DATA",
    UPDATE_PERSON_SEX="UPDATE_PERSON_SEX",
    ADD_PERSON_RELATION="ADD_PERSON_RELATION",
    UPDATE_PERSON_RELATION="UPDATE_PERSON_RELATION",
    /**
     * users creation actions
     */
    UPDATE_USER_CREATION_DATA="UPDATE_USER_CREATION_DATA"
}

enum RelationType {
    PARENT="Батько/мати",
    SPOUSE="Чоловік/дружина",
    CHILD="Син/дочка",
    SIBLING="Брат/сестра",
    RELATIVE="Родич",
    FRIEND="Товариш"
}

export default CreationParamsActions;

export const updateCreationParams = (payload: Partial<CreationParams>): PayloadAction<Partial<CreationParams>> => {
    return {
        type: CreationParamsActions.UPDATE_CREATION_PARAMS,
        payload: payload
    }
}

export const updateJurPersonCreationParams = (payload: Partial<JurPerson>): PayloadAction<Partial<JurPerson>> => {
    return {
        type: CreationParamsActions.UPDATE_JUR_PERSON_CREATION_DATA,
        payload: payload
    }
}

export const updateUserCreationParams = (payload: Partial<User>): PayloadAction<Partial<User>> => {
    return {
        type: CreationParamsActions.UPDATE_USER_CREATION_DATA,
        payload: payload
    }
}

export const updatePersonCreationParams = (payload: Partial<Person>): PayloadAction<Partial<Person>> => {
    return {
        type: CreationParamsActions.UPDATE_PERSON_CREATION_DATA,
        payload: payload
    }
}

export const updatePersonSex = (payload: Sex): PayloadAction<Sex> => {
    return {
        type: CreationParamsActions.UPDATE_PERSON_SEX,
        payload: payload
    }
}

export const addRelationship = (payload: Relationship): PayloadAction<Relationship> => {
    return {
        type: CreationParamsActions.ADD_PERSON_RELATION,
        payload: payload
    }
}

export const updatePassportData = (payload: Partial<PassportData>): PayloadAction<Partial<PassportData>> => {
    return {
        type: CreationParamsActions.UPDATE_PASSPORT_DATA,
        payload: payload
    }
}

export class PersonCreationParams implements Person {
    dateOfBirth = {...new DateBuilder().build()};
    firstName = "";
    lastName = "";
    middleName = "";
    relationshipsLinkObject = new RelationshipsLinkObject();
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
    role: Roles = Roles.USER;
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
    table: Tables,
    personCreationData: Person,
    jurPersonCreationData: JurPerson,
    userCreationData: User,
    pending: boolean
}

export const setPending = (arg: boolean): PayloadAction<boolean> => {
    return {
        type: CreationParamsActions.SET_CREATION_PENDING,
        payload: arg
    }
}

export type CreationParamsReducible = CreationParams | undefined

export const getCreatePersonDto = (creationData: Person): CreatePersonDto => {
    const DOB = creationData.dateOfBirth;

    let date: string | null = null;

    if (DOB) {
        date = new DateBuilder().setDay(DOB.day).setMonth(DOB.month).setYear(DOB.year).buildStringDate();
    }

    const passportNumber = creationData.passportData?.passportNumber;
    const passportSerial = creationData.passportData?.passportSerial;
    const rnokpp = creationData.passportData?.rnokppCode;
    const location = creationData.location;

    const passportData = (passportNumber!==""||passportSerial!==""||rnokpp!=="") ? creationData.passportData : null;

    const personCreationDto: CreatePersonDto = {
        firstName: creationData.firstName,
        lastName: creationData.lastName,
        middleName: creationData.middleName,
    }

    if (location!==null) {
        personCreationDto.location = creationData.location!;
    }

    if (date!==null) {
        personCreationDto.dateOfBirth = date;
    }

    if (passportData!==null) {
        personCreationDto.passportData = {}

        if (rnokpp) {
            personCreationDto.passportData.rnokppCode = rnokpp;
        }

        if (passportNumber) {
            personCreationDto.passportData.passportNumber = passportNumber;
        }

        if (passportSerial) {
            personCreationDto.passportData.passportSerial = passportSerial;
        }
    }

    return personCreationDto;
}

export type CreateJurPersonDto = {
    name: string;
    edrpou?: string;
    dateOfRegistration?: string;
    location?: Location | null;
    benOwnerId?: string;
    ownerId?: string;
}

export type CreateUserDto = Partial<User>

export type CreatePersonDto = {
    firstName: string;
    middleName: string;
    lastName: string;
    passportData?: Partial<PassportData>;
    dateOfBirth?: string;
    location?: Location
}

// @todo i think middle name should be optional
export const getCreateUserDto = (creationData: User): User => {
    return {
        email: creationData.email, firstName: creationData.firstName, lastName: creationData.lastName, middleName: creationData.middleName, password: creationData.password, role: creationData.role
    }
}
// @todo in future, you need check, can u store id in number typed variable. it can be long ;)
export const getCreateJurPersonDto = (creationData: JurPerson): CreateJurPersonDto => {
    const benOwnerId = creationData.benOwner?creationData.benOwner.id:null
    const ownerId = creationData.owner?creationData.owner.id:null

    const DOR = creationData.dateOfRegistration;

    let date: string | null = null;

    if (DOR) {
        date = new DateBuilder().setDay(DOR.day).setMonth(DOR.month).setYear(DOR.year).buildStringDate();
    }

    const location = creationData.location;

    const edrpou = creationData.edrpou;

    const createJurPersonDto: CreateJurPersonDto = {
        name: creationData.name,
    }

    if (location) {
        createJurPersonDto.location = location;
    }

    if (edrpou) {
        createJurPersonDto.edrpou = edrpou;
    }

    if (DOR) {
        createJurPersonDto.dateOfRegistration = date!;
    }

    if (ownerId) {
        createJurPersonDto.ownerId = ownerId;
    }

    if (benOwnerId) {
        createJurPersonDto.benOwnerId = benOwnerId;
    }

    return createJurPersonDto;
}