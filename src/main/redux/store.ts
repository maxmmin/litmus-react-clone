import {configureStore, PayloadAction} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import authReducer, {defaultAuthState} from "./reducers/authReducer";
import appStateReducer, {initialAppState} from "./reducers/appStateReducer";
import {Action, combineReducers} from "redux"
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER    }   from "reduxjs-toolkit-persist";
import {PersistConfig} from "reduxjs-toolkit-persist/es/types";
import storage from 'reduxjs-toolkit-persist/lib/storage'
import userIdentityReducer, {initialUserIdentityState, UserIdentityState} from "./reducers/userIdentityReducer";
import loginPageDataReducer, {initialLoginState} from "./reducers/loginPageDataReducer";
import creationReducer, {
    CreationState,
    defaultCreationState
} from "./reducers/creationStateReducer";
import explorationStateReducer, {
    defaultExplorationState, ExplorationState,
} from "./reducers/explorationStateReducer";
import ErrorResponse from "../rest/ErrorResponse";
import errLoggingMiddleware from "./middlewares/errLoggingMiddleware";
import {AppNotificationType} from "./types/applicationState/Notification";
import AuthAction from "./actions/AuthAction";
import {Authentication} from "./types/auth/Authentication";
import AppState from "./types/applicationState/AppState";
import {LoginPageState} from "./actions/LoginPageDataActions";

const persistConfig: PersistConfig<any> = {
    storage,
    key: "root",
    whitelist: ['authentication'],
    timeout: 1000
}

type StoreState = {
    authentication: Authentication,
    appState: AppState,
    userIdentity: UserIdentityState,
    exploration: ExplorationState,
    loginPageState: LoginPageState,
    creation: CreationState
}

const defaultStoreState: StoreState = {
    appState: initialAppState,
    authentication: defaultAuthState,
    creation: defaultCreationState,
    exploration: defaultExplorationState,
    loginPageState: initialLoginState,
    userIdentity: initialUserIdentityState
}

const _rootReducer = combineReducers({
    authentication: authReducer,
    appState: appStateReducer,
    userIdentity: userIdentityReducer,
    exploration: explorationStateReducer,
    loginPageState: loginPageDataReducer,
    creation: creationReducer
})

const rootReducer: typeof _rootReducer = (state, action) => {
    if (action.type===AuthAction.LOGOUT) {
        const resetState = {...defaultStoreState};
        resetState.appState = {...defaultStoreState.appState};
        return {
            ...defaultStoreState
        }
    } else {
        return _rootReducer(state,action);
    }
}

const persistedReducer = persistReducer(persistConfig, rootReducer) as typeof rootReducer;

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            },
        }).concat(errLoggingMiddleware, thunk),
    enhancers: defaultEnhancers => [...defaultEnhancers],
    devTools: true
})

export default store;

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

/**
 * Type is used for specifying should the state isRefresh or no while redux thunk is pending
 * And should notification be added after it's resolving
 */
export type ThunkMetaData = {
    globalPending: boolean
}

type MetaAction<M> = {
    meta: M
}

export type PendingThunkAction<P> = MetaAction<{
    arg: ThunkArg<P>
}>&Action

export type PossiblePendingThunkAction = Partial<PendingThunkAction<any>>

export type FulfillMeta = {
    successMessage?: string,
    duration?: number,
    notify: boolean,
    notificationType?: AppNotificationType
}

export type RejectedMeta = {
    notify: boolean
}

export type FulfilledThunkAction = Action&MetaAction<FulfillMeta>

export type RejectedThunkAction = PayloadAction<ErrorResponse>&MetaAction<RejectedMeta>

export type ThunkArg<T={}> = T & ThunkMetaData

export type LitmusAsyncThunkConfig = {
    state: RootState
    dispatch: AppDispatch
    extra?: unknown
    rejectValue: unknown
    serializedErrorType?: unknown
    pendingMeta?: unknown
    fulfilledMeta: FulfillMeta
    rejectedMeta: RejectedMeta
}
