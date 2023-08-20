import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import BasicJurPersonExplorationParams from "./BasicJurPersonExplorationParams";
import EntityExplorationState from "../EntityExplorationState";
import EntityExplorationData from "../EntityExplorationData";
import JurPersonExplorationParams from "./JurPersonExplorationParams";
import {ValidationErrors} from "../../../../service/ValidationErrors";

export default interface JurPersonExplorationState extends EntityExplorationState<JurPerson, JurPersonExplorationParams> {

}

export class BasicJurPersonExplorationState implements JurPersonExplorationState {
    readonly data: EntityExplorationData<JurPerson, BasicJurPersonExplorationParams>|null = null;
    readonly isPending: boolean = false;
    readonly params: JurPersonExplorationParams = new BasicJurPersonExplorationParams();
}
