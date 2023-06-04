import {Entity, ExplorationMode, ExplorationModeName} from "../../redux/exploration/EntityExplorationState";
import {PersonExplorationParams} from "../../redux/exploration/person/PersonExploration";
import {UserExplorationParams} from "../../redux/exploration/user/UserExploration";
import {JurPersonExplorationParams} from "../../redux/exploration/jurPerson/JurPersonExploration";

class ExplorationRoutingManager {
    private static actionUrlBase = "explore"

    private static urlPersonDomain: string="persons";
    private static urlJurPersonDomain: string="jur_persons";
    private static urlUsersDomain: string="users";

    /**
     *
     * @param pathName
     * @private
     * "/he/llo/".split("/")
     * (4) ['', 'he', 'llo', '']
     * little tip
     */
    private static getEntityDomain (pathName: string): string {
        let entityDomain = pathName.split("/")[2];
        if (entityDomain.includes("?")) {
            const index = entityDomain.indexOf("?");
            entityDomain = entityDomain.slice(0, index);
        }
        return entityDomain;
    }

    public static getCurrentEntity (pathName: string): Entity|null {
        const entityDomain = this.getEntityDomain(pathName)

        switch (entityDomain[1]) {
            case this.urlPersonDomain: {
                return Entity.PERSON;
            }
            case this.urlJurPersonDomain: {
                return Entity.JUR_PERSON;
            }
            case this.urlUsersDomain: {
                return Entity.USER;
            }
            default: return null;
        }
    }

    public static getCurrentMode (pathName: string): ExplorationMode|null {
        const currentEntity = this.getCurrentEntity(pathName);

        if (!currentEntity) throw new Error("invalid entityService in pathname");

        let supportedModes: Array<ExplorationMode>;

        switch (currentEntity) {
            case Entity.PERSON:
                supportedModes = PersonExplorationParams.supportedModes;
                break;
            case Entity.JUR_PERSON:
                supportedModes = JurPersonExplorationParams.supportedModes;
                break;
            case Entity.USER:
                supportedModes = UserExplorationParams.supportedModes;
                break;
            default: throw new Error("unknown entityService")
        }

        const mode = pathName.split(`/${this.actionUrlBase}/${this.getEntityDomain(pathName)}/`)[1]

        const explorationMode = ExplorationMode[mode as ExplorationModeName];

        return explorationMode?explorationMode:null;
    }

}