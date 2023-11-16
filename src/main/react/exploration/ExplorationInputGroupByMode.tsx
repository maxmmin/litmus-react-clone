import ExplorationMode from "../../redux/types/exploration/ExplorationMode";
import FindByIdGroup from "./InputGroupes/FindByIdGroup";
import FindByFullNameGroup from "./InputGroupes/FindByFullNameGroup";
import {useMemo} from "react";
import FindByJurNameGroup from "./InputGroupes/FindByJurNameInputGroup";
import FindByEmailGroup from "./InputGroupes/FindByEmail";

const jsxMap: Record<number, JSX.Element> = {
    [ExplorationMode.BY_ID.id]: <FindByIdGroup/>,
    [ExplorationMode.BY_FULL_NAME.id]: <FindByFullNameGroup/>,
    [ExplorationMode.BY_JUR_NAME.id]: <FindByJurNameGroup/>,
    [ExplorationMode.BY_EMAIL.id]: <FindByEmailGroup/>,
    [ExplorationMode.FIND_ALL.id]: <></>
};

type Props = {
    mode: ExplorationMode
}

export default function ExplorationInputGroupByMode({mode}: Props) {
    const jsx = useMemo(()=>jsxMap[mode.id], [mode]);


    if (!jsx) {
        throw new Error("unsupported mode");
    }

    return (
        <>
            {jsx}
        </>
    )
}