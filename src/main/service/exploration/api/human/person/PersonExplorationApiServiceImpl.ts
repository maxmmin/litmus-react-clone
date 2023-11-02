import PersonExplorationApiService from "./PersonExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import PersonResponseDto, {
    RelationshipsInfo, SimplePersonResponseDto
} from "../../../../../rest/dto/person/PersonResponseDto";
import {buildUrl} from "../../../../../util/pureFunctions";
export type PersonResponseIdMapDto = Record<number, PersonResponseDto|null>

class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto> implements PersonExplorationApiService {

    constructor() {
        super(appConfig.serverMappings.persons.root);
    }

    async findPersons(idSet: Set<number>, d: number): Promise<PersonResponseIdMapDto> {
        const response = await this.apiInstance<PersonResponseIdMapDto>(buildUrl(appConfig.serverMappings.persons.getByIdList), {
            params: {
                d: d,
                id: [...idSet]
            },
            paramsSerializer: {
                indexes: null
            }
        });
        return response.data;
    }



    async findPersonByIdWithDepthOption(id: number, d: number): Promise<PersonResponseDto|null> {
        const response = await this.apiInstance<PersonResponseDto>(buildUrl(appConfig.serverMappings.persons.root,id.toString()), {
            params: {
                d: d
            }
        });
        return Object.keys(response.data).length>0?response.data:null;
    }

    async findPersonRelationships(id: number, d: number): Promise<RelationshipsInfo> {
        const response = await this.apiInstance<RelationshipsInfo>(buildUrl(appConfig.serverMappings.persons.relationships(id.toString())), {
            params: {
                d: d
            }
        });
        return response.data;
    }

    async findPersonSimpleDto(id: number): Promise<SimplePersonResponseDto|null> {
        const response = await this.apiInstance<PersonResponseDto>(buildUrl(appConfig.serverMappings.persons.root,id.toString()), {
            params: {
                s: true
            }
        });
        return Object.keys(response.data).length>0?response.data:null;
    }



    public static getInstance (): PersonExplorationApiServiceImpl {
        return new PersonExplorationApiServiceImpl();
    }

}

export default PersonExplorationApiServiceImpl;