import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './main/react/App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store, {persistor} from "./main/redux/store";
import {PersistGate } from "reduxjs-toolkit-persist/es/integration/react";
import Loader from "./main/react/loader/Loader";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
    <Provider store={store}>
        <PersistGate loading={<Loader cssAnchor={"fullscreen"}/>} persistor={persistor}>
            <App/>
        </PersistGate>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();