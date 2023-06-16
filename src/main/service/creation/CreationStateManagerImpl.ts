import store, {AppDispatch} from "../../redux/store";
import CreationCoreActions, {
    JurPersonCreationParams,
    PersonCreationParams, UserCreationParams
} from "../../redux/creation/CreationCoreActions";
import {PayloadAction} from "@reduxjs/toolkit";
import CreationTypedAction from "../../redux/creation/CreationTypedActions";
import EntityCreationState from "../../redux/creation/EntityCreationState";
import {Entity} from "../../model/Entity";
import JurPersonExplorationState from "../../redux/exploration/types/jurPerson/JurPersonExplorationState";
import PersonExplorationState from "../../redux/exploration/types/human/person/PersonExplorationState";
import UserExplorationState from "../../redux/exploration/types/human/user/UserExplorationState";
import CreationTypedActions from "../../redux/creation/CreationTypedActions";

class CreationStateManagerImpl<P, S extends EntityCreationState<P>>  {
    private readonly dispatch: AppDispatch;
    private readonly getState: ()=>S;
    private readonly actions: CreationTypedAction;


    constructor(dispatch: AppDispatch, getState: () => S, actions: CreationTypedAction) {
        this.dispatch = dispatch;
        this.getState = getState;
        this.actions = actions;
    }

    public setEntityCreationParams(entityCreationParams: S["params"]) {
        const action: PayloadAction<S["params"]> = {
            type: this.actions[CreationCoreActions.SET_ENTITY_CREATION_PARAMS],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

    public updateEntityCreationParams(entityCreationParams: Partial<S["params"]>) {
        const action: PayloadAction<Partial<S["params"]>> = {
            type: this.actions["UPDATE_CREATION_PARAMS"],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

    static getJurPersonManager (providedStore: typeof store = store): CreationStateManagerImpl<JurPersonCreationParams, EntityCreationState<JurPersonCreationParams>> {
        const getState = ()=>providedStore.getState().creation.jurPerson as EntityCreationState<JurPersonCreationParams>;
        return new CreationStateManagerImpl<JurPersonCreationParams, EntityCreationState<JurPersonCreationParams>>(store.dispatch, getState, CreationTypedAction.jurPerson);
    }

    static getPersonManager (providedStore: typeof store): CreationStateManagerImpl<PersonCreationParams, EntityCreationState<PersonCreationParams>> {
        const getState = ()=>providedStore.getState().creation.person as EntityCreationState<PersonCreationParams>;
        return new CreationStateManagerImpl<PersonCreationParams, EntityCreationState<PersonCreationParams>>(store.dispatch, getState, CreationTypedActions.person);
    }

    static getUserManager (providedStore: typeof store): CreationStateManagerImpl<UserCreationParams, EntityCreationState<UserCreationParams>> {
        const getState = ()=>providedStore.getState().creation.user as EntityCreationState<UserCreationParams>;
        return new CreationStateManagerImpl<UserCreationParams, EntityCreationState<UserCreationParams>>(store.dispatch, getState, CreationTypedActions.user);
    }

    static getEntityManager(entity: Entity, providedStore: typeof store = store): CreationStateManagerImpl<unknown, EntityCreationState<unknown>> {
        switch (entity) {
            case Entity.PERSON: {
                return CreationStateManagerImpl.getPersonManager(providedStore);
            }

            case Entity.JUR_PERSON: {
                return CreationStateManagerImpl.getJurPersonManager(providedStore);
            }

            case Entity.USER: {
                return CreationStateManagerImpl.getUserManager(providedStore);
            }

            default: throw new Error("unsupported entity");
        }
    }
}