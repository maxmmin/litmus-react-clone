import {AsyncThunkAction, configureStore, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import authReducer from "./auth/authReducer";
import appStateReducer from "./applicationState/appStateReducer";
import {Action, combineReducers, Dispatch} from "redux"
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
import userIdentityReducer from "./userIdentity/userIdentityReducer";
import authenticationCheckMiddleware from "./auth/authenticationCheckMiddleware";
import loginPageDataReducer from "./login/LoginPageDataReducer";
import creationParamsReducer from "./creation/creationParamsReducer";
import timersReducer from "./timers/timersReducer";
import explorationReducer from "./exploration/explorationReducer";
import ErrorResponse from "../util/apiRequest/ErrorResponse";
import errLoggingMiddleware from "./log/errLoggingMiddleware";


const persistConfig: PersistConfig<any> = {
    storage,
    key: "root",
    whitelist: ['authentication']
}

const rootReducer = combineReducers({
    authentication: authReducer,
    appState: appStateReducer,
    userIdentity: userIdentityReducer,
    exploration: explorationReducer,
    loginPageState: loginPageDataReducer,
    creationParams: creationParamsReducer,
    timers: timersReducer
} )

const persistedReducer = persistReducer(persistConfig, rootReducer) as typeof rootReducer;

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            },
        }).concat(authenticationCheckMiddleware,errLoggingMiddleware, thunk),
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
export type ThunkArgMeta = {
    globalPending: boolean
}

type MetaAction<M> = {
    meta: M
}

export type PendingThunkAction<P> = MetaAction<{
    arg: ThunkArg<P>
}>&Action

export type PossiblePendingThunkAction = Partial<PendingThunkAction<any>>

export type RejectedThunkAction = PayloadAction<ErrorResponse<any>>

export type FulfillMeta = {
    successMessage?: string,
    duration?: number,
    notify: boolean
}


export type FulfilledThunkAction = Action&MetaAction<FulfillMeta>

export type ThunkArg<T> = T & ThunkArgMeta

export type LitmusAsyncThunkConfig = {
    state: RootState
    dispatch: AppDispatch
    extra?: unknown
    rejectValue: ErrorResponse<any>
    serializedErrorType?: unknown
    pendingMeta?: unknown
    fulfilledMeta: FulfillMeta
    rejectedMeta?: unknown
}
