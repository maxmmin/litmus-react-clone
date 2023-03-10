import {modesDataSource} from "../../types/explorationParams";
import {useAppSelector} from "../../redux/hooks";
import {useMemo} from "react";

function InputGroup (): JSX.Element|null {
    const table = useAppSelector(state => state.explorationParams?.table)
    const explorationMode = useAppSelector(state => state.explorationParams?.mode)

    return useMemo(()=>{
        if (table&&explorationMode&&Object.hasOwn(modesDataSource[table!], explorationMode)) {
            return modesDataSource[table][explorationMode]!.jsx();
        }
        return null
    },[table, explorationMode])
}

export default InputGroup