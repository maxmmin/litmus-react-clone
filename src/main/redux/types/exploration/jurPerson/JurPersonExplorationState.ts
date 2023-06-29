import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import BasicJurPersonExplorationParams from "./BasicJurPersonExplorationParams";
import EntityExplorationState from "../EntityExplorationState";
import EntityExplorationData from "../EntityExplorationData";
import JurPersonExplorationParams from "./JurPersonExplorationParams";

export default interface JurPersonExplorationState extends EntityExplorationState<JurPerson, JurPersonExplorationParams> {

}

export class BasicJurPersonExplorationState implements JurPersonExplorationState {
    readonly data: EntityExplorationData<JurPerson, BasicJurPersonExplorationParams>|null = null;
    readonly isPending: boolean = false;
    readonly params: JurPersonExplorationParams = new BasicJurPersonExplorationParams();
    readonly validationErrors: Partial<Record<keyof JurPersonExplorationParams, string>> = {};
}
