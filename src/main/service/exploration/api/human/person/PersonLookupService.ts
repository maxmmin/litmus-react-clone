import Person from "../../../../../model/human/person/Person";
import HumanExplorationApiService from "../HumanExplorationApiService";

interface PersonLookupService extends HumanExplorationApiService<Person>{
}

export default PersonLookupService;