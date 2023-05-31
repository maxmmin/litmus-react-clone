import ExplorationByFullName from "../../react/screens/Explore/InputGroupes/FindByFullName";
import ExplorationById from "../../react/screens/Explore/InputGroupes/FindById";

export enum Entity {
    PERSONS="PERSONS",
    JUR_PERSONS="JUR_PERSONS",
    USERS="USERS"
}

/**
 * P - params data
 */
export interface EntityExplorationState <P> {
    params: P,
    data: EntityExplorationData<any>
}

// @todo: WRITE ADDITIONAL FLAGS WHICH CAN BE NEEDED
export interface EntityExplorationData <E> {
    get(): Array<E>|null;
}

export class ExplorationMode {
    public static readonly BY_FULL_NAME: ExplorationMode = new ExplorationMode("За ФІО", <ExplorationByFullName/>)
    public static readonly BY_ID: ExplorationMode = new ExplorationMode("За ID", <ExplorationById/>)

    public readonly title: string;
    public readonly jsx: ()=>JSX.Element;

    private constructor(title: string, jsx: JSX.Element) {
        this.title = title;
        this.jsx = ()=>jsx;
    }
}

class PersonExplorationParams {
    public readonly id: string;
    public readonly firstName: string;
    public readonly middleName: string;
    public readonly lastName: string;


    constructor(id: string, firstName: string, middleName: string, lastName: string) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
    }
}

function newInitialPersonExplorationParams (): PersonExplorationParams {
    return new PersonExplorationParams("","","","")
}

class JurPersonExplorationParams {
    public readonly id: string;
    public readonly name: string;


    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

type ModeInfoType = Partial<Record<Mode, {title: string, jsx: ()=>JSX.Element}>>

const modesDataSource: Record<Entity, ModeInfoType> = {
    [Entity.PERSONS]: {
        [Mode.FIND_BY_FULL_NAME]: {
            title: "ФІО",
            jsx: ()=><ExplorationByFullName/>
        },
        [Mode.FIND_BY_ID]: {
            title: "за ID",
            jsx: ()=><ExplorationById/>
        }
    },
    [Entity.JUR_PERSONS]: {
        [Mode.FIND_BY_ID]: {
            title: "за ID",
            jsx: ()=><ExplorationById/>
        }
    },
    [Entity.USERS]: {
        [Mode.FIND_BY_FULL_NAME]: {
            title: "ФІО",
            jsx: ()=><ExplorationByFullName/>
        },
        [Mode.FIND_BY_ID]: {
            title: "за ID",
            jsx: ()=><ExplorationById/>
        }
    }
}

export type BasicHumanSearchPayload = Partial<{
    id: string,
    firstName: string,
    middleName: string,
    lastName: string
}>

// setNullOnEmptyFields () {
//     Object.entries(this).forEach(([key, value]) => {
//         if (typeof value === 'string') {
//
//         }
//     })
// } TODO: IDEA FOR EXPLORATION SERVICE

export class BasicHumanSearchInputInit {
    id: string = "";
    firstName: string = "";
    middleName: string = "";
    lastName: string = "";
}

type Input = Partial<{
    [Entity.PERSONS]: BasicHumanSearchPayload,
    [Entity.USERS]: BasicHumanSearchPayload,
    [Entity.JUR_PERSONS]: {
        id?: string,
        name?: string
    }
}>

export type ExplorationParams = Partial<{
    entity: Entity,
    sectionsSettings: SectionsSettings
    validationErrors: boolean
    input: Input
}>

export type ExplorationParamsReducible = ExplorationParams | undefined

export {modesDataSource}
