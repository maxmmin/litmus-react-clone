import {RoleName} from "../types/userIdentity/Role";
import {DateBuilder} from "../../model/DateEntity";
import Person from "../../model/human/person/Person";
import User from "../../model/human/user/User";
import {JurPerson} from "../../model/jurPerson/JurPerson";

enum CreationCoreAction {
    SET_ENTITY_CREATION_PARAMS="SET_ENTITY_CREATION_PARAMS",
    UPDATE_ENTITY_CREATION_PARAMS="UPDATE_CREATION_PARAMS",
    CREATE_ENTITY="CREATE_ENTITY"
}

export enum PersonCreationAction {
    UPDATE_PASSPORT_DATA="UPDATE_PASSPORT_DATA",
    ADD_PERSON_RELATION="ADD_PERSON_RELATION",
    REMOVE_PERSON_RELATION="REMOVE_PERSON_RELATION",
    UPDATE_PERSON_RELATION="UPDATE_PERSON_RELATION"
}

export default CreationCoreAction;




