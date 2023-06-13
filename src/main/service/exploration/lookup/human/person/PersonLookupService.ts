import Person from "../../../../../model/human/person/Person";
import HumanLookupService from "../HumanLookupService";

interface PersonLookupService extends HumanLookupService<Person>{
}

export default PersonLookupService;