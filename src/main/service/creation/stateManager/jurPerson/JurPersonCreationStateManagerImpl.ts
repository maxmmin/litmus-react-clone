import {
    JurPersonCreationParams,
} from "../../../../redux/actions/CreationCoreActions";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedActions from "../../../../redux/actions/CreationTypedActions";
import JurPersonCreationStateManager from "./JurPersonCreationStateManager";

class JurPersonCreationStateManagerImpl extends CreationStateManagerImpl<EntityCreationState<JurPersonCreationParams>> implements JurPersonCreationStateManager {
    constructor(_store: typeof store = store, actions: CreationTypedActions = CreationTypedActions.person) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = () => _store.getState().creation.jurPerson!;
        super(dispatch, getState, actions);
    }
}

export default JurPersonCreationStateManagerImpl;