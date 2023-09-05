import {configureStore, PayloadAction} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import authReducer from "./reducers/authReducer";
import appStateReducer from "./reducers/appStateReducer";
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
import userIdentityReducer from "./reducers/userIdentityReducer";
import loginPageDataReducer from "./reducers/LoginPageDataReducer";
import creationReducer from "./reducers/creationStateReducer";
import timersReducer from "./reducers/timersReducer";
import explorationStateReducer from "./reducers/explorationStateReducer";
import ErrorResponse from "../rest/ErrorResponse";
import errLoggingMiddleware from "./middlewares/errLoggingMiddleware";
import {AppNotificationType} from "./types/applicationState/Notification";


const persistConfig: PersistConfig<any> = {
    storage,
    key: "root",
    whitelist: ['authentication'],
    timeout: 1000
}

const rootReducer = combineReducers({
    authentication: authReducer,
    appState: appStateReducer,
    userIdentity: userIdentityReducer,
    exploration: explorationStateReducer,
    loginPageState: loginPageDataReducer,
    creation: creationReducer,
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

export type RejectedThunkAction = PayloadAction<ErrorResponse<any>>&MetaAction<RejectedMeta>

export type ThunkArg<T={}> = T & ThunkMetaData

export type LitmusAsyncThunkConfig = {
    state: RootState
    dispatch: AppDispatch
    extra?: unknown
    rejectValue: ErrorResponse<any>
    serializedErrorType?: unknown
    pendingMeta?: unknown
    fulfilledMeta: FulfillMeta
    rejectedMeta: RejectedMeta
}
