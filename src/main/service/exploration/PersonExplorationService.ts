import ExplorationService from "./ExplorationService";
import PersonExplorationApiService from "./api/human/person/PersonExplorationApiService";
import PagedData, {UnPagedData} from "../../rest/PagedData";
import Person from "../../model/human/person/Person";
import PersonExplorationParams from "../../redux/types/exploration/human/person/PersonExplorationParams";
import {createAsyncThunk} from "@reduxjs/toolkit";
import EntityExplorationData from "../../redux/types/exploration/EntityExplorationData";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import {ExplorationTypedAction} from "../../redux/actions/ExplorationTypedAction";
import {ExplorationCoreAction} from "../../redux/actions/ExplorationActions";
import deepCopy from "../../util/deepCopy";
import ExplorationMode from "../../redux/types/exploration/ExplorationMode";
import {checkNotEmpty} from "../../util/pureFunctions";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import handleCreationError from "../creation/handleCreationError";


import UnsupportedModeError from "./UnsupportedModeError";
import PersonExplorationStateManager from "./stateManager/person/PersonExplorationStateManager";
import PersonExplorationStateManagerImpl from "./stateManager/person/PersonExplorationStateManagerImpl";
import PersonExplorationApiServiceImpl from "./api/human/person/PersonExplorationApiServiceImpl";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonExplorationValidationService from "./validation/human/person/PersonExplorationValidationService";
import PersonExplorationValidationServiceImpl from "./validation/human/person/PersonExplorationValidationServiceImpl";
import ValidationError from "../../error/ValidationError";

type PersonExplorationCallbackType = (params: PersonExplorationParams, service: PersonExplorationApiService, mapper: DtoMapper<unknown, Person, PersonResponseDto>) => Promise<PagedData<Person>>;

class PersonExplorationService implements ExplorationService {

    constructor(private readonly stateManager: PersonExplorationStateManager,
                private readonly service: PersonExplorationApiService,
                private readonly mapper: DtoMapper<unknown, Person, PersonResponseDto>,
                private readonly validationService: PersonExplorationValidationService) {
    }

    public static getInstance (stateManager: PersonExplorationStateManager = new PersonExplorationStateManagerImpl(),
                               service: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
                               mapper: DtoMapper<unknown, Person, PersonResponseDto> = new PersonDtoMapper(),
                               validationService: PersonExplorationValidationService = new PersonExplorationValidationServiceImpl()): PersonExplorationService {
       return new PersonExplorationService(stateManager, service, mapper, validationService);
    }

    private exploreByIdCallback: PersonExplorationCallbackType = async (params, service, mapper) => {
        const errors = this.validationService.validateId(params);
        if (errors) {
            throw new ValidationError(errors);
        }
        const id = checkNotEmpty(params.id);
        const content: Person[] = []
        const personResponseDto: PersonResponseDto|null = await service.findById(id);
        if (personResponseDto) {
            const person: Person = mapper.mapToEntity(personResponseDto);
            content.push(person)
        };
        return new UnPagedData(content);
    }

    private exploreByFullNameCallback: PersonExplorationCallbackType = async (params, service, mapper) => {
        const errors = this.validationService.validateFullName(params);
        if (errors) {
            throw new ValidationError(errors);
        }
        const lastName = checkNotEmpty(params.lastName);
        const middleName = params.middleName;
        const firstName = params.firstName;
        const pagedResponse: PagedData<PersonResponseDto> = await service.findByFullName({lastName, middleName, firstName});
        const personArray: Person[] = pagedResponse.content.map(mapper.mapToEntity);
        return {...pagedResponse, content: personArray};
    }

    private callbackMap: Map<ExplorationMode, PersonExplorationCallbackType>
        = new Map<ExplorationMode, PersonExplorationCallbackType>(
            [
                [ExplorationMode.BY_FULL_NAME, this.exploreByFullNameCallback],
                [ExplorationMode.BY_ID, this.exploreByIdCallback]
            ],
    )

    async explore(): Promise<void> {
        this.stateManager.retrieveData(this.explorePersonsThunk({params: this.stateManager.getExplorationParams(), globalPending: false})).catch(console.error)
    }

    private async exploreUponMode (explorationParams: PersonExplorationParams): Promise<PagedData<Person>> {
        const modeId = explorationParams.modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);
        const callback = this.callbackMap.get(mode);
        if (callback) {
            return callback(explorationParams,this.service, this.mapper);
        } else {
            if (explorationParams.supportedModesIdList.includes(modeId)) {
                throw new Error("mod is supported by person exploration params but isn't added to switch branch")
            } else throw new UnsupportedModeError();}
        }

    private explorePersonsThunk = createAsyncThunk<EntityExplorationData<Person, PersonExplorationParams>,
        ThunkArg<{params: PersonExplorationParams}>,
        LitmusAsyncThunkConfig>(ExplorationTypedAction.person[ExplorationCoreAction.RETRIEVE_DATA],(async ({params}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<Person> = await this.exploreUponMode(params);
            const exploredData: EntityExplorationData<Person, PersonExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(deepCopy(exploredData), {notify: false});
        } catch (e: unknown) {
            if (e instanceof ValidationError) {
                this.stateManager.setValidationErrors(e.errors)
            }
            return rejectWithValue(handleCreationError(e), {notify: true});
        }
    }))

}

export default PersonExplorationService;