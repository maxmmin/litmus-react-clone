import ExplorationByFullName from "../../react/screens/Explore/InputGroupes/FindByFullName";
import ExplorationById from "../../react/screens/Explore/InputGroupes/FindById";

export enum Entity {
    PERSON="PERSON",
    JUR_PERSON="JUR_PERSON",
    USER="USER"
}

/**
 * E - entity type
 * P - params type
 */
export interface EntityExplorationState <E,P extends EntityExplorationParams> {
    params: P,
    data: EntityExplorationData<E>
}

export interface EntityExplorationParams {
    mode: ExplorationMode;
    id: string | null;
    supportedModes: ExplorationMode[]
}

export interface BasicHumanExplorationParamsGroup {
    firstName: string | null,
    middleName: string | null,
    lastName: string | null
}

export interface BasicJurPersonExplorationParamsGroup {
    name: string | null
}

export interface EntityExplorationData <E> {
    results: Array<E>|null;
    isFullyLoaded: boolean;
    isPending: boolean
}

// @todo: WRITE ADDITIONAL FLAGS WHICH CAN BE NEEDED
export class BasicEntityExplorationData <E> implements EntityExplorationData<E>{
    readonly results: Array<E>|null = null;
    readonly isFullyLoaded: boolean = false;
    readonly isPending: boolean = false;

    constructor(results?: Array<E>, isFullyLoaded?: boolean, isPending?: boolean) {
        if (results) {
            this.results = results;
        }
        if (isFullyLoaded) {
            this.isFullyLoaded = isFullyLoaded;
        }
        if (isPending) {
            this.isPending = isPending;
        }
    }
}

/**
 * class used for fast access for all exploration modes.
 * Jsx is not stored inside ExplorationMode component because redux object should be POJO
 */
export class ExplorationMode {
    public static readonly BY_FULL_NAME: ExplorationMode = new ExplorationMode("За ФІО")
    public static readonly BY_ID: ExplorationMode = new ExplorationMode("За ID")

    public readonly title: string;

    private constructor(title: string) {
        this.title = title;
    }

    public static getJsx (mode: ExplorationMode): JSX.Element {
        switch (mode) {
            case (this.BY_FULL_NAME): {
                return <ExplorationByFullName/>
            }

            case (this.BY_ID): {
                return <ExplorationById/>
            }

            default: {
                throw new Error("unknown exploration mode value was provided")
            }
        }
    }
}