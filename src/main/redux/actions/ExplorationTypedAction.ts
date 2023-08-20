import TypedActionsUtil from "../../util/TypedActionsUtil";
import {ExplorationCoreAction} from "./ExplorationActions";

export class ExplorationTypedAction {

    public static readonly user: ExplorationTypedAction = new ExplorationTypedAction(TypedActionsUtil.userDomain);
    public static readonly person: ExplorationTypedAction = new ExplorationTypedAction(TypedActionsUtil.personDomain);
    public static readonly jurPerson: ExplorationTypedAction = new ExplorationTypedAction(TypedActionsUtil.jurPersonDomain);


    public readonly [ExplorationCoreAction.SET_EXPLORATION_STATE]: string;

    public readonly [ExplorationCoreAction.SET_EXPLORATION_PARAMS_MODE]: string;
    public readonly [ExplorationCoreAction.SET_EXPLORATION_PARAMS]: string;

    public readonly [ExplorationCoreAction.RETRIEVE_DATA]: string;

    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS]: string;

    public readonly [ExplorationCoreAction.SET_EXPLORATION_STATE_PENDING]: string;

    public readonly [ExplorationCoreAction.SET_EXPLORATION_DATA_RESULTS]: string;

    private constructor(domain: string) {
        const UPDATE_STATE_CORE = ExplorationCoreAction.SET_EXPLORATION_STATE;
        this[UPDATE_STATE_CORE] = TypedActionsUtil.getTypedAction(UPDATE_STATE_CORE, domain);

        const UPDATE_PARAMS_CORE = ExplorationCoreAction.SET_EXPLORATION_PARAMS;
        this[UPDATE_PARAMS_CORE] = TypedActionsUtil.getTypedAction(UPDATE_PARAMS_CORE, domain);

        const UPDATE_DATA_CORE = ExplorationCoreAction.RETRIEVE_DATA;
        this[UPDATE_DATA_CORE] = TypedActionsUtil.getTypedAction(UPDATE_DATA_CORE, domain);

        const UPDATE_PARAMS_MODE_CORE = ExplorationCoreAction.SET_EXPLORATION_PARAMS_MODE;
        this[UPDATE_PARAMS_MODE_CORE] = TypedActionsUtil.getTypedAction(UPDATE_PARAMS_MODE_CORE, domain);

        const UPDATE_DATA_PENDING_CORE = ExplorationCoreAction.SET_EXPLORATION_STATE_PENDING;
        this[UPDATE_DATA_PENDING_CORE] = TypedActionsUtil.getTypedAction(UPDATE_DATA_PENDING_CORE, domain);

        const UPDATE_DATA_RESULTS_CORE = ExplorationCoreAction.SET_EXPLORATION_DATA_RESULTS;
        this[UPDATE_DATA_RESULTS_CORE] = TypedActionsUtil.getTypedAction(UPDATE_DATA_RESULTS_CORE, domain);

        const UPDATE_EXPLORATION_PARAMS = ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS;
        this[UPDATE_EXPLORATION_PARAMS] = TypedActionsUtil.getTypedAction(UPDATE_EXPLORATION_PARAMS, domain);

    }

}