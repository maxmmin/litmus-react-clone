import {useAppSelector} from "../../redux/hooks";
import {RootState} from "../../redux/store";
import {Entity} from "../../redux/exploration/Entity";
import ExplorationMode from "../../redux/exploration/ExplorationMode";

function InputGroup ({exploredEntity}: {exploredEntity: Entity}): JSX.Element|null {
    const exploration: RootState['exploration'] = useAppSelector(state => state.exploration)
    if (!exploredEntity) {
        return null;
    } else {
        let explorationMode: ExplorationMode|null = null;

        switch (exploredEntity) {
            case Entity.PERSON:
                explorationMode = exploration.person!.params.mode;
                break;
            case Entity.JUR_PERSON:
                explorationMode = exploration.jurPerson!.params.mode;
                break;
            case Entity.USER:
                explorationMode = exploration.user!.params.mode;
                break;
            default: throw new Error("provided unknown entity")
        }

        return ExplorationMode.getJsx(explorationMode);
    }
}

export default InputGroup