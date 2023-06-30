import TypedActionsUtil from "../../util/TypedActionsUtil";
import CreationCoreAction from "./CreationCoreAction";

class CreationTypedAction {
    public static readonly user: CreationTypedAction = new CreationTypedAction(TypedActionsUtil.userDomain);
    public static readonly person: CreationTypedAction = new CreationTypedAction(TypedActionsUtil.personDomain);
    public static readonly jurPerson: CreationTypedAction = new CreationTypedAction(TypedActionsUtil.jurPersonDomain);

    public readonly [CreationCoreAction.SET_ENTITY_CREATION_PARAMS]: string;
    public readonly [CreationCoreAction.UPDATE_ENTITY_CREATION_PARAMS]: string;
    public readonly [CreationCoreAction.CREATE_ENTITY]: string;
    public readonly [CreationCoreAction.SET_ENTITY_VALIDATION_ERRORS]: string;
    public readonly [CreationCoreAction.UPDATE_ENTITY_VALIDATION_ERRORS]: string;

    private constructor(domain: string) {
        const SET_ENTITY_CREATION_PARAMS = CreationCoreAction.SET_ENTITY_CREATION_PARAMS;
        this[SET_ENTITY_CREATION_PARAMS] = TypedActionsUtil.getTypedAction(SET_ENTITY_CREATION_PARAMS, domain);

        const UPDATE_ENTITY_CREATION_PARAMS = CreationCoreAction.UPDATE_ENTITY_CREATION_PARAMS;
        this[UPDATE_ENTITY_CREATION_PARAMS] = TypedActionsUtil.getTypedAction(UPDATE_ENTITY_CREATION_PARAMS, domain);

        const CREATE_ENTITY = CreationCoreAction.CREATE_ENTITY;
        this[CREATE_ENTITY] = TypedActionsUtil.getTypedAction(CREATE_ENTITY, domain);

        const SET_VALIDATION_ERRORS = CreationCoreAction.SET_ENTITY_VALIDATION_ERRORS;
        this[SET_VALIDATION_ERRORS] = TypedActionsUtil.getTypedAction(SET_VALIDATION_ERRORS, domain);

        const UPDATE_VALIDATION_ERRORS = CreationCoreAction.UPDATE_ENTITY_VALIDATION_ERRORS;
        this[UPDATE_VALIDATION_ERRORS] = TypedActionsUtil.getTypedAction(UPDATE_VALIDATION_ERRORS, domain);
    }
}

export default CreationTypedAction;