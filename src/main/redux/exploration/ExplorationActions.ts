export enum ExplorationCoreAction{
    UPDATE_EXPLORATION_STATE="UPDATE_EXPLORATION_STATE",
    UPDATE_EXPLORATION_PARAMS="UPDATE_EXPLORATION_PARAMS",
    UPDATE_EXPLORATION_DATA="UPDATE_EXPLORATION_DATA"
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
    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS]: string;
    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_DATA]: string;

    private static getTypedAction(core: ExplorationCoreAction, delimiter: string, type: string) {
        return core+delimiter+type;
    }

    private constructor(domain: string) {
        const UPDATE_STATE_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_STATE;
        this[UPDATE_STATE_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_STATE_CORE, ExplorationTypedActions.delimiter, domain);

        const UPDATE_PARAMS_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS;
        this[UPDATE_PARAMS_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_PARAMS_CORE, ExplorationTypedActions.delimiter, domain);

        const UPDATE_DATA_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_DATA;
        this[UPDATE_DATA_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_DATA_CORE, ExplorationTypedActions.delimiter, domain);
    }

}