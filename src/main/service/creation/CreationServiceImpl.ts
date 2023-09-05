import {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import CreationService from "./CreationService";
import {createAsyncThunk} from "@reduxjs/toolkit";
import deepCopy from "../../util/deepCopy";
import handleRequestError from "./handleRequestError";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationApiService from "./api/CreationApiService";
import CreationStateManager from "./stateManager/CreationStateManager";
import ValidationService from "../ValidationService";
import ValidationError, {ValidationResponse} from "../../error/ValidationError";
import CreationCoreAction from "../../redux/actions/CreationCoreAction";
import {HttpStatus} from "../../rest/HttpStatus";
import ErrorResponse from "../../rest/ErrorResponse";
import {ValidationErrors} from "../ValidationErrors";
import {AxiosError} from "axios";


/**
 * Q - requestDto
 * E - entity
 * P - response dto
 * V - validation object
 * S - server validation type
 */
class CreationServiceImpl<RequestDto,E,ResponseDto, V extends object=ValidationErrors<E>,S extends object=V> implements CreationService<E> {

    protected readonly mapper: DtoMapper<RequestDto, E, ResponseDto>;
    protected readonly apiService: CreationApiService<RequestDto, ResponseDto>;
    protected readonly creationStateManager: CreationStateManager<E,V>;
    protected readonly validationService: ValidationService<E,V,S>

    constructor(apiService: CreationApiService<RequestDto, ResponseDto>,
                creationStateManager: CreationStateManager<E,V>,
                mapper: DtoMapper<RequestDto, E, ResponseDto>,
                validationService: ValidationService<E, V, S>) {
        this.mapper = mapper;
        this.apiService = apiService;
        this.creationStateManager = creationStateManager;
        this.validationService = validationService;
    }

    createEntity(): Promise<E> {
        return this.defaultCreate();
    }

    protected defaultCreate () {
        const emergedEntity = this.creationStateManager.getCreationState().emergingEntity;
        const prefix = this.creationStateManager.getCreationActions()[CreationCoreAction.CREATE_ENTITY];
        const thunkAction = this.createEntityThunk(prefix)({emergingEntity: emergedEntity, globalPending: false});
        return this.creationStateManager.create(thunkAction);
    }

    private createEntityThunk = (prefix: string) => createAsyncThunk<E,
        ThunkArg<{emergingEntity: E}>,
        LitmusAsyncThunkConfig>(prefix,async ({emergingEntity}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const errors = this.validationService.validate(emergingEntity);
            if (this.validationService.hasErrors(errors)) {
                throw new ValidationError(errors);
            }
            const requestDto: RequestDto = this.mapper.mapToRequestDto(emergingEntity);
            const responseDto: ResponseDto = await this.apiService.create(requestDto);
            const entity: E = this.mapper.mapToEntity(responseDto);
            return fulfillWithValue(deepCopy(entity), {notify: true});
        } catch (e: unknown) {
            if (e instanceof ValidationError<unknown>) {
                this.creationStateManager.setValidationErrors(e.errors);
            } else if (Object.hasOwn(e as object, "status")&&(e as ErrorResponse<unknown>).status===HttpStatus.UNPROCESSABLE_ENTITY) {
                const validationResponse = e as ValidationResponse<S>
                const validationErrors = this.validationService.mapServerValidationErrors(validationResponse.detail.validationErrors);
                this.creationStateManager.setValidationErrors(validationErrors);
            }

            return rejectWithValue(handleRequestError(e as AxiosError), {notify: true});
        }
    })


}

export default CreationServiceImpl;