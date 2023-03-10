import {configureStore} from '@reduxjs/toolkit'
import apiSearchReducer from "./reducers/apiSearchReducer";
import thunk from 'redux-thunk'
import authReducer from "./reducers/authReducer";
import appStateReducer from "./reducers/appStateReducer";
import {combineReducers} from "redux"
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
import explorationParamsReducer from "./reducers/explorationParamsReducer";
import authenticationCheckMiddleware from "./authenticationCheckMiddleware";
import loginPageStateReducer from "./reducers/loginPageStateReducer";

const persistConfig: PersistConfig<any> = {
    storage,
    key: "root",
    whitelist: ['authentication']
}

const RootReducer = combineReducers({
    authentication: authReducer,
    appState: appStateReducer,
    userIdentity: userIdentityReducer,
    searchResults: apiSearchReducer,
    explorationParams: explorationParamsReducer,
    loginPageState: loginPageStateReducer
} )

const persistedReducer = persistReducer(persistConfig, RootReducer) as typeof RootReducer

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            },
        }).concat(authenticationCheckMiddleware, thunk),
    enhancers: defaultEnhancers => [...defaultEnhancers],
    devTools: true
})

export default store;

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch