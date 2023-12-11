import {Spinner} from "react-bootstrap";
import React from "react";
import '../assets/styles/loadingPage.scss'

const Loader = () => <div className="loading-page">
    <Spinner className="loading_spinner" animation="grow"/>
    <Spinner className="loading_spinner" animation="grow"/>
    <Spinner className="loading_spinner" animation="grow"/>
</div>

export default Loader