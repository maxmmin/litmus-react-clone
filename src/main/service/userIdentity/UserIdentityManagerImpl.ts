import store, {AppDispatch, LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import {Action} from "redux";
import UserIdentityActions from "../../redux/actions/UserIdentityActions";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import UserIdentity, {UserIdentityReducible} from "../../redux/types/userIdentity/UserIdentity";
import UserIdentityApiService from "./api/UserIdentityApiService";
import UserIdentityManager from "./UserIdentityManager";
import UserIdentityApiServiceImpl from "./api/UserIdentityApiServiceImpl";
import AuthenticationStateManagerImpl from "../auth/stateManager/AuthenticationStateManagerImpl";
import deepCopy from "../../util/deepCopy";
import AuthenticationStateManager from "../auth/stateManager/AuthenticationStateManager";


type RetrieveIdentityThunkArg = ThunkArg<{
    identityService: UserIdentityApiService
}>

class UserIdentityManagerImpl implements UserIdentityManager{
    private readonly dispatch: AppDispatch;
    private readonly getState: () => UserIdentityReducible;

    private readonly identityService: UserIdentityApiService;

    constructor(dispatch: AppDispatch, getState: ()=>UserIdentityReducible, identityService: UserIdentityApiService) {
        this.dispatch = dispatch;
        this.getState = getState;
        this.identityService = identityService;
    }

    static getManager (service: UserIdentityApiService, _store: typeof store): UserIdentityManagerImpl {
        return new UserIdentityManagerImpl(_store.dispatch, ()=>_store.getState().userIdentity, service)
    }

    retrieveIdentity (globalPending: boolean = false): void  {
        const action: AsyncThunkAction<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig> = this._retrieveIdentityThunk({identityService: this.identityService, globalPending: globalPending})
        this.dispatch(action);
    };

    public _retrieveIdentityThunk = createAsyncThunk<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig>(UserIdentityActions.RETRIEVE_IDENTITY, async ({identityService}, {fulfillWithValue, rejectWithValue})=>{
        try {
            const userIdentity: UserIdentity = await identityService.retrieveIdentity();
            return fulfillWithValue(userIdentity, {notify: false});
        }
        catch (e: any) {
            return rejectWithValue(deepCopy(e), {notify: true});
        }
    })

    public clearIdentity () {
        const action: Action<UserIdentityActions> = {type: UserIdentityActions.CLEAR_IDENTITY}
        this.dispatch(action);
    }
}

export default UserIdentityManagerImpl;