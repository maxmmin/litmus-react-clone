import LinkSaver from "./LinkSaver";
import "../assets/styles/linkManager.scss";
import {useAppSelector} from "../../redux/hooks";
import SourceContainableEntityStateManager from "../../service/stateManagers/creation/SourceContainableEntityStateManager";
import {CrossIcon} from "../assets/icons";
import InputError from "../sharedComponents/InputError";

type SourceManagerProps = {
    sourceManager: SourceContainableEntityStateManager
}

export default function SourcesManager ({sourceManager}: SourceManagerProps) {

    const links = useAppSelector(()=>sourceManager.getSources());

    const linksErrors = useAppSelector(()=>sourceManager.getValidationSourcesErrors())

    return (
        <div className={"links-manager-wrapper"}>
            <LinkSaver validationEnabled={true} saveLink={link => sourceManager.appendSource(link)}/>

            <div className="links-manager__links-container">
                {links.map((link, i) => {
                        const errIndex = linksErrors.findIndex(err => err.source === link);
                        const hasError = errIndex > -1;

                        return (
                            <div key={i} className={"links-manger__link-container-wrapper"}>
                                <div className={`links-manager__link-container ${hasError?"is-invalid":""}`}>
                                    <div className="links-manager__link-wrapper no-scrollbar">
                                        <a href={link} className="links-manager__link">{link}</a>
                                    </div>
                                    <button onClick={e=>    {
                                        e.preventDefault();
                                        sourceManager.removeSource(link)

                                        if (hasError) {
                                            const newErrs = [...linksErrors];
                                            newErrs.splice(errIndex, 1);
                                            sourceManager.setValidationSourcesErrors(newErrs);
                                        }
                                    }} className="links-manager__remove-btn btn p-0">
                                        <CrossIcon color={"black"} className={"links-manager__remove-btn-icon rotate45"}/>
                                    </button>
                                </div>
                                <InputError cssAnchor={"link-error"} error={linksErrors.find(obj =>obj.source===link)?.error}/>
                            </div>
                        )
                    }
                )}
            </div>
        </div>
    )
}