import TypedActionsUtil from "../../util/TypedActionsUtil";
import CreationCoreAction from "./CreationCoreAction";

class CreationTypedAction {
    public static readonly user: CreationTypedAction = new CreationTypedAction(TypedActionsUtil.userDomain);
    public static readonly person: CreationTypedAction = new CreationTypedAction(TypedActionsUtil.personDomain);
    public static readonly jurPerson: CreationTypedAction = new CreationTypedAction(TypedActionsUtil.jurPersonDomain);

    public readonly [CreationCoreAction.SET_ENTITY_CREATION_PARAMS]: string;
    public readonly [CreationCoreAction.UPDATE_ENTITY_CREATION_PARAMS]: string;
    public readonly [CreationCoreAction.CREATE_ENTITY]: string;

    private constructor(domain: string) {
        const SET_ENTITY_CREATION_PARAMS = CreationCoreAction.SET_ENTITY_CREATION_PARAMS;
        this[SET_ENTITY_CREATION_PARAMS] = TypedActionsUtil.getTypedAction(SET_ENTITY_CREATION_PARAMS, domain);
        //@TODO write create entity thunk. write validation errors save in state
        const UPDATE_ENTITY_CREATION_PARAMS = CreationCoreAction.UPDATE_ENTITY_CREATION_PARAMS;
        this[UPDATE_ENTITY_CREATION_PARAMS] = TypedActionsUtil.getTypedAction(UPDATE_ENTITY_CREATION_PARAMS, domain);

        const CREATE_ENTITY = CreationCoreAction.CREATE_ENTITY;
        this[CREATE_ENTITY] = TypedActionsUtil.getTypedAction(CREATE_ENTITY, domain);
    }
}

export default CreationTypedAction;