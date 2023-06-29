import EntityExplorationParams from "../../../redux/types/exploration/EntityExplorationParams";
import ValidationService from "../../ValidationService";

interface ExplorationValidationService <P extends EntityExplorationParams> extends ValidationService<P>{
    validateId(params: P): Partial<Record<keyof P, string>>|null;
}

export default ExplorationValidationService;
