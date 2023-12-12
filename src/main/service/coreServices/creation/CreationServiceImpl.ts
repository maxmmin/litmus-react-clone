import {LitmusAsyncThunkConfig, ThunkArg} from "../../../redux/store";
import CreationService from "./CreationService";
import {createAsyncThunk} from "@reduxjs/toolkit";
import serializableDeepCopy from "../../../util/functional/serializableDeepCopy";
import DtoMapper from "../../dtoMappers/DtoMapper";
import CreationApiService from "../../api/CreationApiService";
import CreationStateManager from "../../stateManagers/creation/CreationStateManager";
import ValidationService from "../../validation/ValidationService";
import ValidationError from "../../../error/ValidationError";
import CreationCoreAction from "../../../redux/actions/CreationCoreAction";
import {HttpStatus} from "../../../rest/HttpStatus";
import {ValidationErrors} from "../../../model/ValidationErrors";
import {AxiosError} from "axios";
import {ValidationErrorResponse} from "../../../rest/ErrorResponse";


/**
 * Q - requestDto
 * E - entity
 * P - response dto
 * C - creation params type
 * V - creation object
 * S - server creation type
 */
class CreationServiceImpl<RequestDto,E,ResponseDto, C=E, V extends object=ValidationErrors<C>,S extends object=V,
    VService extends ValidationService<C,V,S> = ValidationService<C,V,S>> implements CreationService<E> {

    protected readonly mapper: DtoMapper<RequestDto, E, ResponseDto, C, any, any>;
    protected readonly apiService: CreationApiService<RequestDto, ResponseDto>;
    protected readonly creationStateManager: CreationStateManager<E,C,V>;
    protected readonly validationService: VService

    constructor(apiService: CreationApiService<RequestDto, ResponseDto>,
                creationStateManager: CreationStateManager<E,C,V>,
                mapper: DtoMapper<RequestDto, E, ResponseDto, C, any, any>,
                validationService: VService) {
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

    protected mapServerValidationObject (r: C, o: S): V {
        return this.validationService.mapServerValidationErrors(r,o);
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
            return fulfillWithValue(serializableDeepCopy(entity), {notify: true});
        } catch (e: unknown) {
            console.error(e)
            if (e instanceof ValidationError<unknown>) {
                this.creationStateManager.setValidationErrors(e.properties.validationErrors);
            } else if (e instanceof AxiosError && e.response?.status===HttpStatus.UNPROCESSABLE_ENTITY) {
                const validationResponse = (e as AxiosError<Partial<ValidationErrorResponse<S>>>).response?.data;
                if (validationResponse) {
                    if (typeof validationResponse.detail === 'object'&&validationResponse.properties?.validationErrors) {
                        const validationErrors = this.mapServerValidationObject(emergingEntity,validationResponse.properties?.validationErrors);
                        this.creationStateManager.setValidationErrors(validationErrors);
                    }
                }
            }
            return rejectWithValue(serializableDeepCopy(e), {notify: true});
        }
    })


}

export default CreationServiceImpl;