import EntityService from "../../EntityService";
import {FullName} from "../../../exploration/FullName";
import Person from "../../../../model/human/person/Person";
import HumanService from "../HumanService";

interface PersonService extends HumanService<Person>{
}

export default PersonService;