import PersonExplorationService from "./PersonExplorationService";
import {FullName} from "../FullName";
import Person from "../../../model/person/Person";

class PersonExplorationServiceImpl implements PersonExplorationService {
    findByFullName(fullName: FullName): Person[] {
    }

    findById(id: string): Person {
    }
}

export default PersonExplorationServiceImpl;