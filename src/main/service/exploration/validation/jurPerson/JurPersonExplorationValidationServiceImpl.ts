import JurPersonExplorationValidationService from "./JurPersonExplorationValidationService";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";
import BasicExplorationValidationService from "../BasicExplorationValidationService";

class JurPersonExplorationValidationServiceImpl extends BasicExplorationValidationService implements JurPersonExplorationValidationService {
    validate(params: JurPersonExplorationParams): Partial<Record<keyof JurPersonExplorationParams, string>> {
        const bindingResult: Partial<Record<keyof JurPersonExplorationParams, string>> = super.validate(params);
        return bindingResult;
    }
}

export default JurPersonExplorationValidationServiceImpl;