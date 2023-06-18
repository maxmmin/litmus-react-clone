import TypedActionsUtil from "../../util/TypedActionsUtil";
import CreationCoreActions from "./CreationCoreActions";

class CreationTypedActions {
    public static readonly user: CreationTypedActions = new CreationTypedActions(TypedActionsUtil.userDomain);
    public static readonly person: CreationTypedActions = new CreationTypedActions(TypedActionsUtil.personDomain);
    public static readonly jurPerson: CreationTypedActions = new CreationTypedActions(TypedActionsUtil.jurPersonDomain);

    public readonly [CreationCoreActions.SET_ENTITY_CREATION_PARAMS]: string;
    public readonly [CreationCoreActions.UPDATE_ENTITY_CREATION_PARAMS]: string;
    public readonly [CreationCoreActions.CREATE_ENTITY]: string;

    private constructor(domain: string) {
        const SET_ENTITY_CREATION_PARAMS = CreationCoreActions.SET_ENTITY_CREATION_PARAMS;
        this[SET_ENTITY_CREATION_PARAMS] = TypedActionsUtil.getTypedAction(SET_ENTITY_CREATION_PARAMS, domain);
        //@TODO write create entity thunk. write validation errors save in state
        const UPDATE_ENTITY_CREATION_PARAMS = CreationCoreActions.UPDATE_ENTITY_CREATION_PARAMS;
        this[UPDATE_ENTITY_CREATION_PARAMS] = TypedActionsUtil.getTypedAction(UPDATE_ENTITY_CREATION_PARAMS, domain);

        const CREATE_ENTITY = CreationCoreActions.CREATE_ENTITY;
        this[CREATE_ENTITY] = TypedActionsUtil.getTypedAction(CREATE_ENTITY, domain);
    }
}

export default CreationTypedActions;