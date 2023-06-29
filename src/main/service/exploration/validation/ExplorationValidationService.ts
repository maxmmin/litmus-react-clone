import EntityExplorationParams from "../../../redux/types/exploration/EntityExplorationParams";

interface ExplorationValidationService <P extends EntityExplorationParams> {
    validate(params: P): Partial<Record<keyof P, string>>
}

export default ExplorationValidationService;
