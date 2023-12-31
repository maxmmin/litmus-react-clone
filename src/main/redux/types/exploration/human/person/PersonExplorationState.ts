import {PreProcessedPerson} from "../../../../../model/human/person/Person";
import PersonExplorationParams, {BasicPersonExplorationParams} from "./PersonExplorationParams";
import EntityExplorationData from "../../EntityExplorationData";
import EntityExplorationState from "../../EntityExplorationState";

export default interface PersonExplorationState extends EntityExplorationState<PreProcessedPerson, PersonExplorationParams> {}

export class BasicPersonExplorationState implements PersonExplorationState {
    data: EntityExplorationData<PreProcessedPerson, PersonExplorationParams>|null = null;
    isPending: boolean = false;
    params: PersonExplorationParams = new BasicPersonExplorationParams();
}

