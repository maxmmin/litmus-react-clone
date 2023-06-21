import store, {AppDispatch, LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import CreationService from "./CreationService";
import Person from "../../model/human/person/Person";
import {createAsyncThunk} from "@reduxjs/toolkit";
import CreationTypedAction from "../../redux/actions/CreationTypedAction";
import CreationCoreAction from "../../redux/actions/CreationCoreAction";
import PersonRequestDto from "../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import deepCopy from "../../util/deepCopy";
import handleCreationError from "./handleCreationError";
import JurPersonDtoMapper from "../../rest/dto/dtoMappers/JurPersonDtoMapper";
import JurPersonCreationApiService from "./api/JurPersonCreationApiService";
import JurPersonCreationStateManager from "./stateManager/jurPerson/JurPersonCreationStateManager";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationApiService from "./api/CreationApiService";
import CreationStateManager from "./stateManager/CreationStateManager";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";


type CreationStore = ReturnType<typeof store.getState>["creation"]

/**
 * Q - requestDto
 * E - entity
 * P - response dto
 * S - creationState
 */
class CreationServiceImpl<RequestDto,E,ResponseDto,S extends EntityCreationState<E>> implements CreationService {

    private mapper: DtoMapper<RequestDto, E, ResponseDto>;
    private apiService: CreationApiService<RequestDto, ResponseDto>;
    private creationStateManager: CreationStateManager<E,S>;

    constructor(mapper: DtoMapper<RequestDto, E, ResponseDto>, apiService: CreationApiService<RequestDto, ResponseDto>, creationStateManager: CreationStateManager<E, S>) {
        this.mapper = mapper;
        this.apiService = apiService;
        this.creationStateManager = creationStateManager;
    }

    createEntity(): void {
        const emergedEntity = this.creationStateManager.getCreationState().emergingEntity;
        this.creationStateManager.create.bind(this)(this.createEntityThunk({globalPending: false, emergingEntity: emergedEntity})).catch(console.error)
    }

    private createEntityThunk = createAsyncThunk<E,
        ThunkArg<{emergingEntity: E}>,
        LitmusAsyncThunkConfig>(CreationTypedAction.person[CreationCoreAction.CREATE_ENTITY],async ({emergingEntity}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const requestDto: RequestDto = this.mapper.mapToRequestDto(emergingEntity);
            const responseDto: ResponseDto = await this.apiService.create(requestDto);
            const entity: E = this.mapper.mapToEntity(responseDto);
            return fulfillWithValue(deepCopy(entity), {notify: true});
        } catch (e: unknown) {
            return rejectWithValue(handleCreationError(e), {notify: true});
        }
    })


}

export default CreationServiceImpl;