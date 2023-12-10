import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import JurPersonCreationStateManager from "./JurPersonCreationStateManager";
import {PreProcessedJurPerson} from "../../../../model/jurPerson/JurPerson";
import {GeoLocation} from "../../../../model/GeoLocation";
import {
    JurPersonValidationObject
} from "../../../validation/jurPerson/JurPersonCreationValidationService";
import {JurPersonCreationParams} from "../../../../redux/types/creation/JurPersonCreationState";
import MediaEntityCreationStateManagerImpl from "../MediaEntityCreationStateManagerImpl";

class JurPersonCreationStateManagerImpl extends MediaEntityCreationStateManagerImpl<PreProcessedJurPerson,JurPersonCreationParams, JurPersonValidationObject>
                                    implements JurPersonCreationStateManager {
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

    removeSource(source: string): number {
        const sources = this.getSources();
        const sIndex = sources.indexOf(source);
        if (sIndex === -1) throw new Error("source does not found")
        else {
            const copy = [...sources];
            copy.splice(sIndex, 1);
            this.setSources(copy);
            return copy.length;
        }
    }

    setSources(sources: string[]): void {
        this.updateEntityCreationParams({sources: sources})
    }

    appendSource(source: string): number {
        const sources: string[] = [...this.getSources(), source];
        this.setSources(sources);
        return sources.length;
    }

    getSources(): string[] {
        return this.getCreationParams().sources;
    }



}

export default JurPersonCreationStateManagerImpl;