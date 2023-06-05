import FindByFullNameGroup from "../../react/exploration/InputGroupes/FindByFullNameGroup";
import FindByIdGroup from "../../react/exploration/InputGroupes/FindByIdGroup";

export enum ExplorationModeName {
    BY_FULL_NAME="BY_FULL_NAME",
    BY_ID="BY_ID"
}

/**
 * class used for fast access for all exploration modes.
 * Jsx is not stored inside ExplorationMode component because redux object should be POJO
 */
export default class ExplorationMode {
    public static readonly [ExplorationModeName.BY_FULL_NAME]: ExplorationMode = new ExplorationMode("За ФІО");
    public static readonly [ExplorationModeName.BY_ID]: ExplorationMode = new ExplorationMode("За ID");

    public readonly title: string;

    private constructor(title: string) {
        this.title = title;
    }

    public static getJsx (mode: ExplorationMode): JSX.Element {
        switch (mode) {
            case (this.BY_FULL_NAME): {
                return <FindByFullNameGroup/>
            }

            case (this.BY_ID): {
                return <FindByIdGroup/>
            }

            default: {
                throw new Error("unknown exploration mode value was provided")
            }
        }
    }
}