import JurPersonCreationValidationService from "./JurPersonCreationValidationService";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";

class JurPersonCreationValidationServiceImpl implements JurPersonCreationValidationService {
    validate(params: JurPersonExplorationParams): Partial<Record<keyof JurPersonExplorationParams, string>> {
        const bindingResult: Partial<Record<keyof JurPersonExplorationParams, string>> = {};
        return bindingResult;
    }
}

export default JurPersonCreationValidationServiceImpl;