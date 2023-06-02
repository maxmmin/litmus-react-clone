import PersonExplorationService from "./PersonExplorationService";
import {FullName} from "../FullName";
import Person from "../../../model/person/Person";

class PersonExplorationServiceImpl implements PersonExplorationService {
    findByFullName(fullName: FullName): Promise<Person> {
    }

    exploreById(id: string): void {
    }
}

export default PersonExplorationServiceImpl;