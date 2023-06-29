import ExplorationStateManager from "./ExplorationStateManager";
import HumanExplorationParams from "../../../redux/types/exploration/human/HumanExplorationParams";
import Human from "../../../model/human/Human";

export default interface HumanExplorationStateManager<E extends Human, P extends HumanExplorationParams>
    extends ExplorationStateManager<E, P> {
        getFirstName(): P["firstName"],
        getMiddleName(): P["middleName"],
        getLastName(): P["lastName"]
}