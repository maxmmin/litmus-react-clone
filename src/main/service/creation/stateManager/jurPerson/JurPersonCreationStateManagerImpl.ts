import {
    JurPersonCreationParams,
    PersonCreationAction,
    PersonCreationParams
} from "../../../../redux/creation/CreationCoreActions";
import EntityCreationState from "../../../../redux/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedActions from "../../../../redux/creation/CreationTypedActions";

class JurPersonCreationStateManager extends CreationStateManagerImpl<EntityCreationState<JurPersonCreationParams>> implements JurPersonCreationStateManager {
    constructor(_store: typeof store = store, actions: CreationTypedActions = CreationTypedActions.person) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = () => _store.getState().creation.person!;
        super(dispatch, getState, actions);
    }
}

export default JurPersonCreationStateManager;