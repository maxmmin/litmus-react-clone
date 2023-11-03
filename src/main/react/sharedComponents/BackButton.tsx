import {BackButtonIcon} from "../assets/icons";
import {useLocation} from "react-router";
import {useNavigate} from "react-router-dom";
import appConfig from "../../config/appConfig";

type PropsType = {
    className?: string,
    path?: string
}

const BackButton = ({className = "", path}: PropsType) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div onClick={()=>{
            if (typeof path === 'string') {
                navigate(path);
            } else {
                if (location.key !== "default") {
                    navigate(-1);
                } else navigate(appConfig.applicationMappings.root)
            }
        }} className={`back-button-container ${className}`}>
            <BackButtonIcon className="w-100 h-100 back-button-icon"/>
        </div>
    )
}

export default BackButton;