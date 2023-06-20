import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import JurPersonCreationStateManager from "./JurPersonCreationStateManager";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";

class JurPersonCreationStateManagerImpl extends CreationStateManagerImpl<JurPerson, EntityCreationState<JurPerson>> implements JurPersonCreationStateManager {
    constructor(_store: typeof store, actions: CreationTypedAction = CreationTypedAction.jurPerson) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = () => _store.getState().creation.jurPerson!;
        super(dispatch, getState, actions);
    }
}

export default JurPersonCreationStateManagerImpl;