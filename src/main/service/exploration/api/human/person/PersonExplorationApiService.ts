import Person from "../../../../../model/human/person/Person";
import HumanExplorationApiService from "../HumanExplorationApiService";

interface PersonExplorationApiService extends HumanExplorationApiService<Person>{
}

export default PersonExplorationApiService;