import store, {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import {Action} from "redux";
import UserIdentityActions from "../../redux/userIdentity/UserIdentityActions";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import UserIdentity from "../../redux/userIdentity/UserIdentity";
import UserIdentityApiService from "./api/UserIdentityApiService";
import UserIdentityManager from "./UserIdentityManager";
import UserIdentityServiceImpl from "./api/UserIdentityServiceImpl";
import AuthenticationStateManagerImpl from "../auth/stateManager/AuthenticationStateManagerImpl";
import deepCopy from "../../util/deepCopy";


type RetrieveIdentityThunkArg = ThunkArg<{
    identityService: UserIdentityApiService
}>

class UserIdentityManagerImpl implements UserIdentityManager{
    private readonly _store: typeof store;
    private readonly identityService: UserIdentityApiService;

    constructor(_store: typeof store = store, identityService?: UserIdentityApiService) {
        this._store = _store;
        if (!identityService) {
            identityService = new UserIdentityServiceImpl(()=>new AuthenticationStateManagerImpl().getAuth()!.accessToken)
        }
        this.identityService = identityService;
    }

    retrieveIdentity (globalPending: boolean = false): void  {
        const action: AsyncThunkAction<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig> = this._retrieveIdentityThunk({identityService: this.identityService, globalPending: globalPending})
        this._store.dispatch(action);
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
        this._store.dispatch(action);
    }
}

export default UserIdentityManagerImpl;