import ExplorationMode from "../../redux/types/exploration/ExplorationMode";
import FindByIdGroup from "./InputGroupes/FindByIdGroup";
import FindByFullNameGroup from "./InputGroupes/FindByFullNameGroup";
import {useMemo} from "react";

const jsxMap: Map<ExplorationMode,JSX.Element> = new Map();

jsxMap.set(ExplorationMode.BY_ID,<FindByIdGroup/>);
jsxMap.set(ExplorationMode.BY_FULL_NAME, <FindByFullNameGroup/>);
jsxMap.set(ExplorationMode.FIND_ALL, <></>)

type Props = {
    mode: ExplorationMode
}

export default function ExplorationInputGroupByMode({mode}: Props) {
    const jsx = useMemo(()=>jsxMap.get(mode), [mode]);


    if (!jsx) {
        throw new Error("unsupported mode");
    }

    return (
        <>
            {jsx}
        </>
    )
}