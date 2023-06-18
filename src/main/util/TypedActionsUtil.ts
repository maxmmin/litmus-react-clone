import {ExplorationCoreAction, ParsedAction} from "../redux/actions/ExplorationActions";

class TypedActionsUtil {

    public static readonly userDomain = "USER";
    public static readonly personDomain = "PERSON";
    public static readonly jurPersonDomain = "JUR_PERSON";
    private static readonly delimiter = "@";

    public static getTypedAction(core: string, type: string, delimiter: string = TypedActionsUtil.delimiter) {
        if (core.indexOf(delimiter)>-1) throw new Error(`forbidden symbol in ${core}: ${delimiter}`)
        return type+delimiter+core;
    }

    public static parseAction(typedAction: string, delimiter: string = TypedActionsUtil.delimiter): ParsedAction|null {
        const parsedAction = typedAction.split(delimiter);
        if (parsedAction.length!==2) return null;
        else {
            const [domain, core] = parsedAction;
            return {domain: domain, core: core};
        }
    }
}

export default TypedActionsUtil;