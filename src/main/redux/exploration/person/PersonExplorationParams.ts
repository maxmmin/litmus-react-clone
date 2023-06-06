import ExplorationMode from "../ExplorationMode";
import BasicHumanExplorationParamsGroup from "../BasicHumanExplorationParamsGroup";

export default class PersonExplorationParams implements BasicHumanExplorationParamsGroup{
    public static supportedModes: ExplorationMode[] = Array.from([ExplorationMode.BY_ID, ExplorationMode.BY_FULL_NAME]);
    public readonly supportedModes: ExplorationMode[] = PersonExplorationParams.supportedModes;

    readonly mode: ExplorationMode = ExplorationMode.BY_FULL_NAME;
    readonly i: number = 0;
    readonly id: string | null = null;
    readonly firstName: string | null = null;
    readonly middleName: string | null = null;
    readonly lastName: string | null = null;


    constructor(mode?: ExplorationMode, i?: number,  id?: string, firstName?: string, middleName?: string, lastName?: string) {
        if (mode) {
            this.mode = mode;
        }
        if (i!==undefined&&!isNaN(Number(i))) {
            this.i = i;
        }
        if (id) {
            this.id = id;
        }
        if (firstName) {
            this.firstName=firstName;
        }
        if (middleName) {
            this.middleName=middleName;
        }
        if (lastName) {
            this.lastName=lastName;
        }
    }
}