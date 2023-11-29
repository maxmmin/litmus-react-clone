import store, {AppDispatch, LitmusAsyncThunkConfig, ThunkArg} from "../../../redux/store";
import {Action} from "redux";
import UserIdentityActions from "../../../redux/actions/UserIdentityActions";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import UserIdentity from "../../../model/userIdentity/UserIdentity";
import UserIdentityApiService from "../../api/userIdentity/UserIdentityApiService";
import UserIdentityManager from "./UserIdentityManager";
import UserIdentityApiServiceImpl from "../../api/userIdentity/UserIdentityApiServiceImpl";
import serializableDeepCopy from "../../../util/functional/serializableDeepCopy";
import UserIdentityDtoMapper from "../../dtoMappers/userIdentity/UserIdentityDtoMapper";
import UserIdentityDtoMapperImpl from "../../dtoMappers/userIdentity/UserIdentityDtoMapperImpl";
import UserIdentityResponseDto from "../../../rest/dto/UserIdentityResponseDto";


type RetrieveIdentityThunkArg = ThunkArg

class UserIdentityManagerImpl implements UserIdentityManager{
    protected readonly dispatch: AppDispatch = store.dispatch;
    protected readonly identityService: UserIdentityApiService;
    protected readonly userIdentityDtoMapper: UserIdentityDtoMapper;

    constructor(identityService: UserIdentityApiService,
                userIdentityDtoMapper: UserIdentityDtoMapper) {
        this.identityService = identityService;
        this.userIdentityDtoMapper = userIdentityDtoMapper;
    }

    static getInstance (service: UserIdentityApiService = UserIdentityApiServiceImpl.getInstance(),
                        userIdentityDtoMapper: UserIdentityDtoMapper = UserIdentityDtoMapperImpl.getInstance()): UserIdentityManagerImpl {
        return new UserIdentityManagerImpl(service, userIdentityDtoMapper)
    }

    async retrieveIdentity (globalPending: boolean = false): Promise<UserIdentity>  {
        const action: AsyncThunkAction<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig> = this._retrieveIdentityThunk({globalPending: globalPending})
        return await this.dispatch(action).unwrap();
    };

    public _retrieveIdentityThunk = createAsyncThunk<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig>(UserIdentityActions.RETRIEVE_IDENTITY, async ({}, {fulfillWithValue, rejectWithValue})=>{
        try {
            const userIdentityDto: UserIdentityResponseDto = await this.identityService.retrieveIdentity();
            const userIdentity = this.userIdentityDtoMapper.map(userIdentityDto);
            return fulfillWithValue(serializableDeepCopy(userIdentity), {notify: false});
        }
        catch (e: unknown) {
            return rejectWithValue(serializableDeepCopy(e), {notify: true});
        }
    })

    async clearIdentity (): Promise<void> {
        const action: Action<UserIdentityActions> = {type: UserIdentityActions.CLEAR_IDENTITY}
        this.dispatch(action);
        return Promise.resolve();
    }
}

export default UserIdentityManagerImpl;