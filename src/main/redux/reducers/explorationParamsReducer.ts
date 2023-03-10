import {Reducer} from "react";
import {
    ExplorationParams,
    BasicHumanSearchPayload,
    Tables,
    BasicHumanSearchInputInit
} from "../../types/explorationParams";

import ExplorationActions,{ExplorationAction} from "../actions/ExplorationParamsActions";
import {AuthActions} from "../actions/AuthActions";

const initialState: ExplorationParams = {
    input: {
        [Tables.PERSONS]: {...new BasicHumanSearchInputInit()},
        [Tables.USERS]: {...new BasicHumanSearchInputInit()}
    }
}

const explorationParamsReducer: Reducer<ExplorationParams, ExplorationAction> = (prev=initialState, action) => {
    switch (action.type) {
        case ExplorationActions.UPDATE_EXPLORATION_PARAMS:
            return {...prev,...action.payload};

        case ExplorationActions.CLEAR_EXPLORATION_PARAMS:
            return null;

        case ExplorationActions.SET_CURRENT_INPUT_DATA: {
            const input = action.payload as BasicHumanSearchPayload;

            return {...prev, input: {
                    ...prev?.input, [prev!.table!]:  input
                }}
        }

        case AuthActions.CLEAR_AUTH: {
            return initialState
        }

        default: return prev;
    }
}

export default explorationParamsReducer