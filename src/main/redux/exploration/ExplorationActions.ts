export enum ExplorationCoreAction{
    SET_EXPLORATION_STATE="SET_EXPLORATION_STATE",
    SET_EXPLORATION_PARAMS="SET_EXPLORATION_PARAMS",
    SET_EXPLORATION_DATA="SET_EXPLORATION_DATA",
    SET_EXPLORATION_PARAMS_MODE="SET_EXPLORATION_PARAMS_MODE",
    SET_EXPLORATION_STATE_PENDING="SET_EXPLORATION_STATE_PENDING",
    SET_EXPLORATION_DATA_RESULTS="SET_EXPLORATION_DATA_RESULTS"

}

export type ParsedAction = {
    core: string,
    domain: string
} | null

export class ExplorationTypedActions {
    public static readonly userDomain = "USER";
    public static readonly personDomain = "PERSON";
    public static readonly jurPersonDomain = "JUR_PERSON";
    private static readonly delimiter = "@";

    public static readonly user: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.userDomain);
    public static readonly person: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.personDomain);
    public static readonly jurPerson: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.jurPersonDomain);


    public readonly [ExplorationCoreAction.SET_EXPLORATION_STATE]: string;

    public readonly [ExplorationCoreAction.SET_EXPLORATION_PARAMS_MODE]: string;
    public readonly [ExplorationCoreAction.SET_EXPLORATION_PARAMS]: string;

    public readonly [ExplorationCoreAction.SET_EXPLORATION_DATA]: string;

    public readonly [ExplorationCoreAction.SET_EXPLORATION_STATE_PENDING]: string;

    public readonly [ExplorationCoreAction.SET_EXPLORATION_DATA_RESULTS]: string;

    private static getTypedAction(core: ExplorationCoreAction, type: string, delimiter: string = ExplorationTypedActions.delimiter) {
        if (core.indexOf(delimiter)>-1) throw new Error(`forbidden symbol in ${core}: ${delimiter}`)
        return type+delimiter+core;
    }

    public static parseAction(typedAction: string, delimiter: string = ExplorationTypedActions.delimiter): ParsedAction|null {
        const parsedAction = typedAction.split(delimiter);
        if (parsedAction.length!==2) return null;
        else {
            const [domain, core] = parsedAction;
            return {domain: domain, core: core};
        }
    }

    private constructor(domain: string) {
        const UPDATE_STATE_CORE = ExplorationCoreAction.SET_EXPLORATION_STATE;
        this[UPDATE_STATE_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_STATE_CORE, domain);

        const UPDATE_PARAMS_CORE = ExplorationCoreAction.SET_EXPLORATION_PARAMS;
        this[UPDATE_PARAMS_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_PARAMS_CORE, domain);

        const UPDATE_DATA_CORE = ExplorationCoreAction.SET_EXPLORATION_DATA;
        this[UPDATE_DATA_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_DATA_CORE, domain);

        const UPDATE_PARAMS_MODE_CORE = ExplorationCoreAction.SET_EXPLORATION_PARAMS_MODE;
        this[UPDATE_PARAMS_MODE_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_PARAMS_MODE_CORE, domain);

        const UPDATE_DATA_PENDING_CORE = ExplorationCoreAction.SET_EXPLORATION_STATE_PENDING;
        this[UPDATE_DATA_PENDING_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_DATA_PENDING_CORE, domain);

        const UPDATE_DATA_RESULTS_CORE = ExplorationCoreAction.SET_EXPLORATION_DATA_RESULTS;
        this[UPDATE_DATA_RESULTS_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_DATA_RESULTS_CORE, domain)
    }

}