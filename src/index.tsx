import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './main/App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store, {persistor} from "./main/redux/store";
import {PersistGate } from "reduxjs-toolkit-persist/es/integration/react";
import {useAppDispatch, useAppSelector} from "./main/redux/hooks";
import Loader from "./main/screens/components/Loader";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <Provider store={store}>
        <PersistGate loading={<Loader/>} persistor={persistor}>
            <App/>
        </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
