import store, {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import {Action} from "redux";
import UserIdentityActions from "../../redux/userIdentity/UserIdentityActions";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import UserIdentity from "../../redux/userIdentity/UserIdentity";
import UserIdentityService from "./UserIdentityService";
import deepCopy from "../../util/pureFunctions";
import UserIdentityManager from "./UserIdentityManager";
import UserIdentityServiceImpl from "./UserIdentityServiceImpl";
import AuthenticationStateManager from "../auth/AuthenticationStateManager";


type RetrieveIdentityThunkArg = ThunkArg<{
    identityService: UserIdentityService
}>

class UserIdentityManagerImpl implements UserIdentityManager{
    private readonly _store: typeof store;
    private readonly identityService: UserIdentityService;

    constructor(_store: typeof store = store, identityService?: UserIdentityService) {
        this._store = _store;
        if (!identityService) {
            identityService = new UserIdentityServiceImpl(()=>new AuthenticationStateManager().getAuth()!.accessToken)
        }
        this.identityService = identityService;
    }

    retrieveIdentity (): void  {
        const action: AsyncThunkAction<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig> = this._retrieveIdentityThunk({identityService: this.identityService, globalPending: false})
        this._store.dispatch(action);
    };

    public _retrieveIdentityThunk = createAsyncThunk<UserIdentity, RetrieveIdentityThunkArg, LitmusAsyncThunkConfig>(UserIdentityActions.RETRIEVE_IDENTITY, async ({identityService}, {fulfillWithValue, rejectWithValue})=>{
        try {
            const userIdentity: UserIdentity = await identityService.retrieveIdentity();
            return fulfillWithValue(userIdentity, {notify: false});
        }
        catch (e: any) {
            return rejectWithValue(deepCopy(e));
        }
    })

    public clearIdentity () {
        const action: Action<UserIdentityActions> = {type: UserIdentityActions.CLEAR_IDENTITY}
        this._store.dispatch(action);
    }
}

export default UserIdentityManagerImpl;