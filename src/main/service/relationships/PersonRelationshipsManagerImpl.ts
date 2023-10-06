import RelationshipsScanService from "./RelationshipsScanService";
import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
import Person from "../../model/human/person/Person";

type PersonStore = Map<string,Person>

class BasicPersonRelationshipsManager {
    constructor(protected readonly relationShipsScanService: RelationshipsScanService,
                protected readonly personExplorationApiService: PersonExplorationApiService) {
    }

    private readonly personStore: PersonStore = new Map();

    private loadRelationships () {

    }
}