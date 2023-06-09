import HumanExplorationParams from "../HumanExplorationParams";

abstract class BasicHumanExplorationParams implements HumanExplorationParams {
    abstract readonly modeId: number;
    abstract readonly supportedModesIdList: number[];
    readonly i: number = 0;
    readonly id: string | null = null;
    readonly firstName: string | null = null;
    readonly middleName: string | null = null;
    readonly lastName: string | null = null;


    protected constructor(i?: number, id?: string, firstName?: string, middleName?: string, lastName?: string) {
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

export default BasicHumanExplorationParams;