import "../assets/styles/pageNotFound.scss"

import {NavLink} from "react-router-dom";
import appConfig from "../../config/appConfig";

export default function PageNotFound () {
    return (
        <div className="page-not-found">
            <div className="page-not-found__content-block">
                <h1 className="page-not-found__status-code">404</h1>
                <div className="page-not-found__strip"></div>
                <div className="page-not-found__details-container">
                    <p className="page-not-found__details">Oops... Seems you try to get the page that not exists</p>
                    <NavLink to={appConfig.applicationMappings.root}>Go home</NavLink>
                </div>
            </div>
        </div>
    )
}