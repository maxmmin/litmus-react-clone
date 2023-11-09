import {NetworkStatusPageProps} from "./NetworkStatusPageProps";
import { ReactComponent as CloudOffIcon } from '../assets/img/cloudOff.svg';
import "../assets/styles/netErrPage.scss";

export default function ({refresh}: NetworkStatusPageProps) {
    return (
        <div className={"network-status-page"}>
            <div className="network-status-page__cloud-off-icon-container">
                <CloudOffIcon className={"network-status-page__cloud-off-icon"}/>
            </div>

            <h4>Seems it's something wrong with your connection</h4>
            <h5>Try again later</h5>
            <h6>or</h6>
            <button className={"network-status-page__refresh-btn btn btn-primary"}>Refresh</button>
        </div>
    )
}