import {configureStore} from '@reduxjs/toolkit'
import explorationDataReducer from "./exploration/data/explorationDataReducer";
import thunk from 'redux-thunk'
import authReducer from "./auth/authReducer";
import appStateReducer from "./applicationState/appStateReducer";
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
import userIdentityReducer from "./userIdentity/userIdentityReducer";
import explorationParamsReducer from "./exploration/params/explorationParamsReducer";
import authenticationCheckMiddleware from "./auth/authenticationCheckMiddleware";
import signUpPageDataReducer from "./signUp/signUpPageDataReducer";
import creationParamsReducer from "./creation/creationParamsReducer";
import timersReducer from "./timers/timersReducer";
import notificationManagerMiddleware from "./applicationState/notificationManagerMiddleware";
import explorationReducer from "./exploration/explorationReducer";

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
    loginPageState: signUpPageDataReducer,
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
        }).concat(authenticationCheckMiddleware, notificationManagerMiddleware, thunk),
    enhancers: defaultEnhancers => [...defaultEnhancers],
    devTools: true
})

export default store;

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch