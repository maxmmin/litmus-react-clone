import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import JurPersonCreationStateManager from "./JurPersonCreationStateManager";
import {JurPerson, PreProcessedJurPerson} from "../../../../model/jurPerson/JurPerson";
import {GeoLocation} from "../../../../model/GeoLocation";
import {
    JurPersonValidationObject,
    ServerJurPersonValidationObject
} from "../../../validation/jurPerson/JurPersonCreationValidationService";
import {JurPersonCreationParams} from "../../../../redux/types/creation/JurPersonCreationState";
import MediaEntityCreationStateManagerImpl from "../MediaEntityCreationStateManagerImpl";

class JurPersonCreationStateManagerImpl extends MediaEntityCreationStateManagerImpl<PreProcessedJurPerson,JurPersonCreationParams, JurPersonValidationObject> implements JurPersonCreationStateManager {
    constructor() {
        const dispatch: AppDispatch = store.dispatch;
        const getState = () => store.getState().creation.jurPerson!;
        super(dispatch, getState, CreationTypedAction.jurPerson);
    }

    clearLocation(): void {
        this.updateLocation(null);
    }

    updateLocation(location: GeoLocation|null): void {
        this.updateEntityCreationParams({location: location})
    }

    getLocation(): GeoLocation | null {
        return this.getCreationParams().location;
    }


}

export default JurPersonCreationStateManagerImpl;