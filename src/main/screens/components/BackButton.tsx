import backIcon from "../../img/boxArrowLeft.svg"
import {useNavigate} from "react-router-dom";
import {BackButtonIcon} from "../../data/icons";

type PropsType = {
    className?: string,
    path: string
}

const BackButton = ({className = "", path}: PropsType) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=>navigate(path)} className={`back-button-container ${className}`}>
            <BackButtonIcon className="w-100 h-100 back-button-icon"/>
        </div>
    )
}

export default BackButton;