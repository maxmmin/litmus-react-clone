import ExplorationValidationService from "./ExplorationValidationService";
import EntityExplorationParams from "../../../redux/types/exploration/EntityExplorationParams";

export default class BasicExplorationValidationService implements ExplorationValidationService<EntityExplorationParams> {
    validate(explorationParams: EntityExplorationParams): Partial<Record<keyof EntityExplorationParams, string>> {
        return  {id: this.testId(explorationParams.id)};
    }

    private testId (id: EntityExplorationParams["id"]): string|undefined {
        if (id) {
            if (isNaN(+id)) {
                return "Введіть валідний ID";
            }
        }
    }

    validateId(params: EntityExplorationParams): Partial<Record<keyof EntityExplorationParams, string>>|null {
        const bindingResult: Partial<Record<keyof EntityExplorationParams, string>> = {id: this.testId(params.id)};;
        if (this.hasErrors(bindingResult)) {
            return bindingResult;
        } else return null;
    }

    hasErrors (bindingResult: object) {
        return  Object.values(bindingResult).some(element=>element!==undefined);
    }

}