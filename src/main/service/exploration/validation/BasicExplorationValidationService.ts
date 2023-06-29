import ExplorationValidationService from "./ExplorationValidationService";
import EntityExplorationParams from "../../../redux/types/exploration/EntityExplorationParams";

export default class BasicExplorationValidationService implements ExplorationValidationService<EntityExplorationParams> {
    validate(explorationParams: EntityExplorationParams): Partial<Record<keyof EntityExplorationParams, string>> {
        return {id: this.isIdValid(explorationParams.id)};
    }

    private isIdValid (id: EntityExplorationParams["id"]): string|undefined {
        if (id) {
            if (isNaN(+id)) {
                return "Введіть валідний ID";
            }
        }
    }

}