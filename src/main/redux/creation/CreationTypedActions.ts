import TypedActionsUtil from "../../util/TypedActionsUtil";
import CreationCoreActions from "./CreationCoreActions";

class CreationTypedActions {
    public static readonly user: CreationTypedActions = new CreationTypedActions(TypedActionsUtil.userDomain);
    public static readonly person: CreationTypedActions = new CreationTypedActions(TypedActionsUtil.personDomain);
    public static readonly jurPerson: CreationTypedActions = new CreationTypedActions(TypedActionsUtil.jurPersonDomain);


    public static readonly [CreationCoreActions.SET_CREATION_PARAMS]: string;
    public static readonly [CreationCoreActions.UPDATE_CREATION_PARAMS]: string;


    public readonly [CreationCoreActions.SET_ENTITY_CREATION_PARAMS]: string;
    public readonly [CreationCoreActions.UPDATE_ENTITY_CREATION_PARAMS]: string;

    private constructor(domain: string) {
        const SET_ENTITY_CREATION_PARAMS = CreationCoreActions.SET_ENTITY_CREATION_PARAMS;
        this[SET_ENTITY_CREATION_PARAMS] = TypedActionsUtil.getTypedAction(SET_ENTITY_CREATION_PARAMS, domain);

        const UPDATE_ENTITY_CREATION_PARAMS = CreationCoreActions.UPDATE_ENTITY_CREATION_PARAMS;
        this[UPDATE_ENTITY_CREATION_PARAMS] = TypedActionsUtil.getTypedAction(UPDATE_ENTITY_CREATION_PARAMS, domain);
    }
}

export default CreationTypedActions;