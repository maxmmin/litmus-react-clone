import {Reducer} from "react";
import {
    BasicHumanSearchInputInit,
    BasicHumanSearchPayload,
    ExplorationParams,
    ExplorationParamsReducible,
    Modes, SectionsSettings,
    Tables
} from "../../types/explorationParams";

import ExplorationActions from "../actions/ExplorationParamsActions";
import {AuthActions} from "../actions/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";

const initialState: ExplorationParamsReducible = {
    table: Tables.PERSONS,
    sectionsSettings: {
        PERSONS: Modes.FIND_BY_FULL_NAME,
        JUR_PERSONS: Modes.FIND_BY_ID,
        USERS: Modes.FIND_BY_FULL_NAME
    },
    input: {
        [Tables.PERSONS]: {...new BasicHumanSearchInputInit()},
        [Tables.USERS]: {...new BasicHumanSearchInputInit()}
    }
}

const explorationParamsReducer: Reducer<ExplorationParamsReducible, PayloadAction<ExplorationParams>> = (prev=initialState, action) => {
    switch (action.type) {
        case ExplorationActions.UPDATE_EXPLORATION_PARAMS:
            return {...prev,...action.payload};

        case ExplorationActions.UPDATE_SECTION_PARAMS:
            return {...prev, sectionsSettings: {...(prev!.sectionsSettings as SectionsSettings), ...action.payload}};

        case ExplorationActions.CLEAR_EXPLORATION_PARAMS:
            return initialState;

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