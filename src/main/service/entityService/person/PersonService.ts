import EntityService from "../EntityService";
import {FullName} from "../../exploration/FullName";
import Person from "../../../model/person/Person";

interface PersonService extends EntityService<Person>{
    findByFullName (fullName: FullName): Promise<Person[]>
}

export default PersonService;