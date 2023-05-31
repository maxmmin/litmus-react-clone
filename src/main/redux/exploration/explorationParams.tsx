import FindByFullName from "../../react/screens/Explore/InputGroupes/FindByFullName";
import FindById from "../../react/screens/Explore/InputGroupes/FindById";
import {BasicHttpError} from "../../util/HttpStatus";

export enum Entity {
    PERSONS="PERSONS",
    JUR_PERSONS="JUR_PERSONS",
    USERS="USERS"
}

export enum Mode {
    FIND_BY_FULL_NAME="FIND_BY_FULL_NAME",
    FIND_BY_ID="FIND_BY_ID"
}

type ModeInfoType = Partial<Record<Mode, {title: string, jsx: ()=>JSX.Element}>>

const modesDataSource: Record<Entity, ModeInfoType> = {
    [Entity.PERSONS]: {
        [Mode.FIND_BY_FULL_NAME]: {
            title: "ФІО",
            jsx: ()=><FindByFullName/>
        },
        [Mode.FIND_BY_ID]: {
            title: "за ID",
            jsx: ()=><FindById/>
        }
    },
    [Entity.JUR_PERSONS]: {
        [Mode.FIND_BY_ID]: {
            title: "за ID",
            jsx: ()=><FindById/>
        }
    },
    [Entity.USERS]: {
        [Mode.FIND_BY_FULL_NAME]: {
            title: "ФІО",
            jsx: ()=><FindByFullName/>
        },
        [Mode.FIND_BY_ID]: {
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
    [Entity.PERSONS]: BasicHumanSearchPayload,
    [Entity.USERS]: BasicHumanSearchPayload,
    [Entity.JUR_PERSONS]: {
        id?: string,
        name?: string
    }
}>

export type SectionsSettings = Record<Entity, Mode>

export type ExplorationParams = Partial<{
    entity: Entity,
    sectionsSettings: SectionsSettings
    isInvalid: boolean
    input: Input
}>

export type ExplorationParamsReducible = ExplorationParams | undefined

export {modesDataSource}
