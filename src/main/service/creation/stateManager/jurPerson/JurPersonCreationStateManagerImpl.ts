import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import JurPersonCreationStateManager from "./JurPersonCreationStateManager";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../inversify/IOC_TYPES";

@injectable()
class JurPersonCreationStateManagerImpl extends CreationStateManagerImpl<JurPerson, EntityCreationState<JurPerson>> implements JurPersonCreationStateManager {
    constructor(@inject(IOC_TYPES.Store)_store: typeof store, @inject(IOC_TYPES.JurPersonCreationTypedAction) actions: CreationTypedAction) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = () => _store.getState().creation.jurPerson!;
        super(dispatch, getState, actions);
    }
}

export default JurPersonCreationStateManagerImpl;