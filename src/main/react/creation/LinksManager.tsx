import LinkSaver from "./LinkSaver";
import "../assets/styles/linkManager.scss";
import {useAppSelector} from "../../redux/hooks";

export interface LinkStateManager {
    setLinks(links: string[]): void;
    getLinks(): string[];
}

type LinkManagerProps = {
    linkManager: LinkStateManager
}

export default function LinksManager ({linkManager}: LinkManagerProps) {

    const links = useAppSelector(()=>linkManager.getLinks());

    return (
        <div className={"links-manager-wrapper"}>
            <LinkSaver/>

            {links.map(link =>
                <div className={"links-manager__link-container"}>
                    <a href={link} className="links-manager__link">{link}</a>
                </div>
            )}
        </div>
    )
}