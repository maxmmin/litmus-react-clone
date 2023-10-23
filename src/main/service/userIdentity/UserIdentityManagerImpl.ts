import store, {AppDispatch, LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import {Action} from "redux";
import UserIdentityActions from "../../redux/actions/UserIdentityActions";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import UserIdentity, {UserIdentityStateReducible} from "../../redux/types/userIdentity/UserIdentity";
import UserIdentityApiService from "./api/UserIdentityApiService";
import UserIdentityManager from "./UserIdentityManager";
import UserIdentityApiServiceImpl from "./api/UserIdentityApiServiceImpl";
import deepCopy from "../../util/deepCopy";
import handleRequestError from "../creation/handleRequestError";


type RetrieveIdentityThunkArg = ThunkArg<{
    identityService: UserIdentityApiService
}>

class UserIdentityManagerImpl implements UserIdentityManager{
    protected readonly dispatch: AppDispatch = store.dispatch;
    protected readonly identityService: UserIdentityApiService;

    constructor(identityService: UserIdentityApiService) {
        this.identityService = identityService;
    }

    static getInstance (service: UserIdentityApiService = UserIdentityApiServiceImpl.getInstance()): UserIdentityManagerImpl {
        return new UserIdentityManagerImpl(service)
    }

    async retrieveIdentity (globalPending: boolean = false): Promise<UserIdentity>  {
        const action: AsyncThunkAction<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig> = this._retrieveIdentityThunk({identityService: this.identityService, globalPending: globalPending})
        return await this.dispatch(action).unwrap();
    };

    public _retrieveIdentityThunk = createAsyncThunk<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig>(UserIdentityActions.RETRIEVE_IDENTITY, async ({identityService}, {fulfillWithValue, rejectWithValue})=>{
        try {
            const userIdentity: UserIdentity = await identityService.retrieveIdentity();
            return fulfillWithValue(deepCopy(userIdentity), {notify: false});
        }
        catch (e: any) {
            return rejectWithValue(handleRequestError(e), {notify: true});
        }
    })

    async clearIdentity (): Promise<void> {
        const action: Action<UserIdentityActions> = {type: UserIdentityActions.CLEAR_IDENTITY}
        this.dispatch(action);
        return Promise.resolve();
    }
}

export default UserIdentityManagerImpl;