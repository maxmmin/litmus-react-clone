import {PreProcessedJurPerson} from "../../../../model/jurPerson/JurPerson";
import BasicJurPersonExplorationParams from "./BasicJurPersonExplorationParams";
import EntityExplorationState from "../EntityExplorationState";
import EntityExplorationData from "../EntityExplorationData";
import JurPersonExplorationParams from "./JurPersonExplorationParams";

export default interface JurPersonExplorationState extends EntityExplorationState<PreProcessedJurPerson, JurPersonExplorationParams> {

}

export class BasicJurPersonExplorationState implements JurPersonExplorationState {
    readonly data: EntityExplorationData<PreProcessedJurPerson, BasicJurPersonExplorationParams>|null = null;
    readonly isPending: boolean = false;
    readonly params: JurPersonExplorationParams = new BasicJurPersonExplorationParams();
}
