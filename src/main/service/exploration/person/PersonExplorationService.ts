import ExplorationService from "../ExplorationService";
import {FullName} from "../FullName";
import Person from "../../../model/person/Person";

interface PersonExplorationService extends ExplorationService<Person>{
    findByFullName (fullName: FullName): Promise<Person>
}

export default PersonExplorationService;