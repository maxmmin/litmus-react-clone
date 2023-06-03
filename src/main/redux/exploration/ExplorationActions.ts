export enum ExplorationCoreAction{
    UPDATE_EXPLORATION_STATE="UPDATE_EXPLORATION_STATE",
    UPDATE_EXPLORATION_PARAMS="UPDATE_EXPLORATION_PARAMS",
    UPDATE_EXPLORATION_DATA="UPDATE_EXPLORATION_DATA",
    UPDATE_EXPLORATION_PARAMS_MODE="UPDATE_EXPLORATION_PARAMS_MODE",
    UPDATE_EXPLORATION_DATA_PENDING="UPDATE_EXPLORATION_DATA_PENDING",
    UPDATE_EXPLORATION_DATA_RESULTS="UPDATE_EXPLORATION_DATA_RESULTS"

}

export class ExplorationTypedActions {
    private static readonly userDomain = "USER";
    private static readonly personDomain = "PERSON";
    private static readonly jurPersonDomain = "JUR_PERSON";
    private static readonly delimiter = "@";

    public static readonly user: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.userDomain);
    public static readonly person: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.personDomain);
    public static readonly jurPerson: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.jurPersonDomain);


    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_STATE]: string;

    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS_MODE]: string;
    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS]: string;

    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_DATA]: string;

    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING]: string;

    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_DATA_RESULTS]: string;

    private static getTypedAction(core: ExplorationCoreAction, type: string, delimiter: string = ExplorationTypedActions.delimiter) {
        if (core.indexOf(delimiter)>-1) throw new Error(`forbidden symbol in ${core}: ${delimiter}`)
        return core+delimiter+type;
    }

    public static getCoreAction(typedAction: string, delimiter: string = ExplorationTypedActions.delimiter): string {
        return typedAction.split(delimiter)[1]
    }

    private constructor(domain: string) {
        const UPDATE_STATE_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_STATE;
        this[UPDATE_STATE_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_STATE_CORE, domain);

        const UPDATE_PARAMS_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS;
        this[UPDATE_PARAMS_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_PARAMS_CORE, domain);

        const UPDATE_DATA_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_DATA;
        this[UPDATE_DATA_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_DATA_CORE, domain);

        const UPDATE_PARAMS_MODE_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS_MODE;
        this[UPDATE_PARAMS_MODE_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_PARAMS_MODE_CORE, domain);

        const UPDATE_DATA_PENDING_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING;
        this[UPDATE_DATA_PENDING_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_DATA_PENDING_CORE, domain);

        const UPDATE_DATA_RESULTS_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_DATA_RESULTS;
        this[UPDATE_DATA_RESULTS_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_DATA_RESULTS_CORE, domain)
    }

}