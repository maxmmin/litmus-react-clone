import {useNavigate} from "react-router-dom";
import {BackButtonIcon} from "../../util/icons";

type PropsType = {
    className?: string,
    path: string|-1
}

const BackButton = ({className = "", path}: PropsType) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=>navigate(path as string)} className={`back-button-container ${className}`}>
            <BackButtonIcon className="w-100 h-100 back-button-icon"/>
        </div>
    )
}

export default BackButton;