import {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import CreationService from "./CreationService";
import {createAsyncThunk} from "@reduxjs/toolkit";
import deepCopy from "../../util/functional/deepCopy";
import handleRequestError from "./handleRequestError";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationApiService from "./api/CreationApiService";
import CreationStateManager from "./stateManager/CreationStateManager";
import ValidationService from "../ValidationService";
import ValidationError from "../../error/ValidationError";
import CreationCoreAction from "../../redux/actions/CreationCoreAction";
import {HttpStatus} from "../../rest/HttpStatus";
import {ValidationErrors} from "../ValidationErrors";
import {AxiosError} from "axios";
import {ValidationErrorResponse} from "../../rest/ErrorResponse";


/**
 * Q - requestDto
 * E - entityPageComponents
 * P - response dto
 * C - creation params type
 * V - validation object
 * S - server validation type
 */
class CreationServiceImpl<RequestDto,E,ResponseDto, C=E, V extends object=ValidationErrors<C>,S extends object=V> implements CreationService<E> {

    protected readonly mapper: DtoMapper<RequestDto, E, ResponseDto, C>;
    protected readonly apiService: CreationApiService<RequestDto, ResponseDto>;
    protected readonly creationStateManager: CreationStateManager<E,C,V>;
    protected readonly validationService: ValidationService<C,V,S>

    constructor(apiService: CreationApiService<RequestDto, ResponseDto>,
                creationStateManager: CreationStateManager<E,C,V>,
                mapper: DtoMapper<RequestDto, E, ResponseDto, C>,
                validationService: ValidationService<C, V, S>) {
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
        const thunkAction = this.createEntityThunk(prefix)({emergingEntity: emergedEntity, globalPending: true});
        return this.creationStateManager.create(thunkAction);
    }

    private createEntityThunk = (prefix: string) => createAsyncThunk<E,
        ThunkArg<{emergingEntity: C}>,
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
                this.creationStateManager.setValidationErrors(e.properties.validationErrors);
            } else if (e instanceof AxiosError && e.response?.status===HttpStatus.UNPROCESSABLE_ENTITY) {
                const validationResponse = (e as AxiosError<Partial<ValidationErrorResponse<S>>>).response?.data;
                if (validationResponse) {
                    if (typeof validationResponse.detail === 'object'&&validationResponse.properties?.validationErrors) {
                        const validationErrors = this.validationService.mapServerValidationErrors(validationResponse.properties?.validationErrors);
                        this.creationStateManager.setValidationErrors(validationErrors);
                    }
                }
            }
            return rejectWithValue(handleRequestError(e as any), {notify: true});
        }
    })


}

export default CreationServiceImpl;