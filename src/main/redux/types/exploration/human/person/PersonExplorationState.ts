import Person, {RawRelationshipsPerson} from "../../../../../model/human/person/Person";
import PersonExplorationParams, {BasicPersonExplorationParams} from "./PersonExplorationParams";
import EntityExplorationData from "../../EntityExplorationData";
import EntityExplorationState from "../../EntityExplorationState";
import {ValidationErrors} from "../../../../../service/ValidationErrors";

export default interface PersonExplorationState extends EntityExplorationState<RawRelationshipsPerson, PersonExplorationParams> {}

export class BasicPersonExplorationState implements PersonExplorationState {
    data: EntityExplorationData<RawRelationshipsPerson, PersonExplorationParams>|null = null;
    isPending: boolean = false;
    params: PersonExplorationParams = new BasicPersonExplorationParams();
}

