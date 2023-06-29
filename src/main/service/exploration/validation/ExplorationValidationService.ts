import EntityExplorationParams from "../../../redux/types/exploration/EntityExplorationParams";
import ValidationService from "../../ValidationService";
import {ValidationErrors} from "../../ValidationErrors";

interface ExplorationValidationService <P extends EntityExplorationParams> extends ValidationService<P>{
    validateId(params: P): ValidationErrors<P>|null;
}

export default ExplorationValidationService;
