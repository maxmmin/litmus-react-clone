import PersonExplorationApiService, {
    PersonResponseIdMapDto,
    ShortPersonIdMapDto,
    SimplePersonIdMapDto
} from "./PersonExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import PersonResponseDto, {
    RelationshipsInfo
} from "../../../../../rest/dto/person/PersonResponseDto";
import {buildUrl} from "../../../../../util/pureFunctions";
import {PersonSimpleResponseDto} from "../../../../../rest/dto/person/PersonSimpleResponseDto";
import {PersonShortResponseDto} from "../../../../../rest/dto/person/PersonShortResponseDto";
import {LookupMode} from "../../../../../model/LookupMode";



class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto, PersonSimpleResponseDto,
    PersonShortResponseDto> implements PersonExplorationApiService {

    constructor() {
        super(appConfig.serverMappings.persons.root);
    }

    async findPersons(idSet: Set<number>, d: number): Promise<PersonResponseIdMapDto> {
        const response = await this.apiInstance<PersonResponseIdMapDto>(buildUrl(appConfig.serverMappings.persons.getByIdList), {
            params: {
                mode: LookupMode.DETAILED,
                d: d,
                id: [...idSet]
            },
            paramsSerializer: {
                indexes: null
            }
        });
        return response.data;
    }

    async findSimplePersons(idList: Set<number>): Promise<SimplePersonIdMapDto> {
        const response = await this.apiInstance<SimplePersonIdMapDto>(buildUrl(appConfig.serverMappings.persons.getByIdList), {
            params: {
                mode: LookupMode.SIMPLE,
                id: [...idList]
            },
            paramsSerializer: {
                indexes: null
            }
        });
        return response.data;
    }

    async findShortPersons(idList: Set<number>): Promise<ShortPersonIdMapDto> {
        const response = await this.apiInstance<ShortPersonIdMapDto>(buildUrl(appConfig.serverMappings.persons.getByIdList), {
            params: {
                mode: LookupMode.SHORT,
                id: [...idList]
            },
            paramsSerializer: {
                indexes: null
            }
        });
        return response.data;
    }

    async findByIdWithDepthOption(id: number, d: number): Promise<PersonResponseDto|null> {
        const response = await this.apiInstance<PersonResponseDto>(buildUrl(appConfig.serverMappings.persons.root,id.toString()), {
            params: {
                mode: LookupMode.DETAILED,
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

    async findPersonSimpleDto(id: number): Promise<PersonSimpleResponseDto|null> {
        const response = await this.apiInstance<PersonResponseDto>(buildUrl(appConfig.serverMappings.persons.root,id.toString()), {
            params: {
                mode: LookupMode.SIMPLE
            }
        });
        return Object.keys(response.data).length>0?response.data:null;
    }



    public static getInstance (): PersonExplorationApiServiceImpl {
        return new PersonExplorationApiServiceImpl();
    }

}

export default PersonExplorationApiServiceImpl;