import FindByFullName from "../screens/Explore/InputGroupes/FindByFullName";
import FindById from "../screens/Explore/InputGroupes/FindById";
import {HttpError} from "../data/httpErrors";

enum Tables {
    PERSONS="PERSONS",
    JUR_PERSONS="JUR_PERSONS",
    USERS="USERS"
}

enum Modes {
    FIND_BY_FULL_NAME="FIND_BY_FULL_NAME",
    FIND_BY_ID="FIND_BY_ID"
}

type ModeInfoType = Partial<Record<Modes, {title: string, jsx: ()=>JSX.Element}>>

const modesDataSource: Record<Tables, ModeInfoType> = {
    [Tables.PERSONS]: {
        [Modes.FIND_BY_FULL_NAME]: {
            title: "ФІО",
            jsx: ()=><FindByFullName/>
        },
        [Modes.FIND_BY_ID]: {
            title: "за ID",
            jsx: ()=><FindById/>
        }
    },
    [Tables.JUR_PERSONS]: {
        [Modes.FIND_BY_ID]: {
            title: "за ID",
            jsx: ()=><FindById/>
        }
    },
    [Tables.USERS]: {
        [Modes.FIND_BY_FULL_NAME]: {
            title: "ФІО",
            jsx: ()=><FindByFullName/>
        },
        [Modes.FIND_BY_ID]: {
            title: "за ID",
            jsx: ()=><FindById/>
        }
    }
}

export type BasicHumanSearchPayload = Partial<{
    id: string,
    firstName: string,
    middleName: string,
    lastName: string
}>

export class BasicHumanSearchInputInit {
    id: string = "";
    firstName: string = "";
    middleName: string = "";
    lastName: string = "";
}

type Input = Partial<{
    [Tables.PERSONS]: BasicHumanSearchPayload,
    [Tables.USERS]: BasicHumanSearchPayload,
    [Tables.JUR_PERSONS]: {
        id?: string,
        name?: string
    }
}>


export type ExplorationParams = Partial<{
    table: Tables,
    mode: Modes,
    isInvalid: boolean
    input: Input
}> | undefined | null

export {Tables, Modes, modesDataSource}
