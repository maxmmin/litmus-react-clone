import Person from "../../../../../model/human/person/Person";
import PersonExplorationParams, {BasicPersonExplorationParams} from "./PersonExplorationParams";
import EntityExplorationData from "../../EntityExplorationData";
import EntityExplorationState from "../../EntityExplorationState";
import {ValidationErrors} from "../../../../../service/ValidationErrors";

export default interface PersonExplorationState extends EntityExplorationState<Person, PersonExplorationParams> {}

export class BasicPersonExplorationState implements EntityExplorationState<Person, PersonExplorationParams>{
    data: EntityExplorationData<Person, PersonExplorationParams>|null = null;
    isPending: boolean = false;
    params: PersonExplorationParams = new BasicPersonExplorationParams();
    validationErrors: ValidationErrors<PersonExplorationParams> = {};

}

