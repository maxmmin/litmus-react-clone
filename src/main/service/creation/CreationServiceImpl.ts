import {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import CreationService from "./CreationService";
import {createAsyncThunk} from "@reduxjs/toolkit";
import deepCopy from "../../util/deepCopy";
import handleCreationError from "./handleCreationError";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationApiService from "./api/CreationApiService";
import CreationStateManager from "./stateManager/CreationStateManager";
import ValidationService from "../ValidationService";
import {hasErrors} from "../exploration/validation/BasicExplorationValidationService";
import ValidationError from "../../error/ValidationError";
import CreationCoreAction from "../../redux/actions/CreationCoreAction";


/**
 * Q - requestDto
 * E - entity
 * P - response dto
 * S - creationState
 */
class CreationServiceImpl<RequestDto,E,ResponseDto> implements CreationService {

    private readonly mapper: DtoMapper<RequestDto, E, ResponseDto>;
    private readonly apiService: CreationApiService<RequestDto, ResponseDto>;
    private readonly creationStateManager: CreationStateManager<E>;
    private readonly validationService: ValidationService<E>

    constructor(apiService: CreationApiService<RequestDto, ResponseDto>,
                creationStateManager: CreationStateManager<E>,
                mapper: DtoMapper<RequestDto, E, ResponseDto>,
                validationService: ValidationService<E>) {
        this.mapper = mapper;
        this.apiService = apiService;
        this.creationStateManager = creationStateManager;
        this.validationService = validationService;
    }

    createEntity(): void {
        const emergedEntity = this.creationStateManager.getCreationState().emergingEntity;
        const prefix = this.creationStateManager.getCreationActions()[CreationCoreAction.CREATE_ENTITY];
        const thunkAction = this.createEntityThunk(prefix)({emergingEntity: emergedEntity, globalPending: false});
        this.creationStateManager.create(thunkAction).catch(console.error);
    }

    private createEntityThunk = (prefix: string) => createAsyncThunk<E,
        ThunkArg<{emergingEntity: E}>,
        LitmusAsyncThunkConfig>(prefix,async ({emergingEntity}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const errors = this.validationService.validate(emergingEntity);
            if (hasErrors(errors)) {
                throw new ValidationError(errors);
            }
            const requestDto: RequestDto = this.mapper.mapToRequestDto(emergingEntity);
            const responseDto: ResponseDto = await this.apiService.create(requestDto);
            const entity: E = this.mapper.mapToEntity(responseDto);
            return fulfillWithValue(deepCopy(entity), {notify: true});
        } catch (e: unknown) {
            if (e instanceof ValidationError) {
                this.creationStateManager.setValidationErrors(e.errors);
            }
            return rejectWithValue(handleCreationError(e), {notify: true});
        }
    })


}

export default CreationServiceImpl;