import LinkSaver from "./LinkSaver";
import "../assets/styles/linkManager.scss";
import {useAppSelector} from "../../redux/hooks";
import SourceInEntityStateManager from "../../service/stateManagers/creation/SourceInEntityStateManager";

export interface LinkStateManager {
    setLinks(links: string[]): void;
    getLinks(): string[];
}

type SourceManagerProps = {
    sourceManager: SourceInEntityStateManager
}

export default function SourcesManager ({sourceManager}: SourceManagerProps) {

    const links = useAppSelector(()=>sourceManager.getSources());

    return (
        <div className={"links-manager-wrapper"}>
            <LinkSaver saveLink={link => sourceManager.appendSource(link)}/>

            <div className="links-manager__links-container">
                {links.map(link =>
                    <div className={"links-manager__link-container"}>
                        <div className="links-manager__link-container-inner no-scrollbar">
                            <a href={link} className="links-manager__link">{link}</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}