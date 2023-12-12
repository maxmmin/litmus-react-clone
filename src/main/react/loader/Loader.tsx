import {Spinner} from "react-bootstrap";
import React from "react";
import '../assets/styles/loadingPage.scss'

const Loader = ({cssAnchor = ""}: {cssAnchor?: string}) => <div className={`loading-page ${cssAnchor}`}>
    <Spinner className="loading_spinner" animation="grow"/>
    <Spinner className="loading_spinner" animation="grow"/>
    <Spinner className="loading_spinner" animation="grow"/>
</div>

export default Loader