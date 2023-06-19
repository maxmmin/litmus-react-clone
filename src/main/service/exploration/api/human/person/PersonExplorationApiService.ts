import Person from "../../../../../model/human/person/Person";
import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto from "../../../../../rest/dto/person/PersonResponseDto";

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto>{
}

export default PersonExplorationApiService;