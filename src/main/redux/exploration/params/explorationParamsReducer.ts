import {Reducer} from "react";
import {
    BasicHumanSearchInputInit,
    BasicHumanSearchPayload,
    ExplorationParams,
    ExplorationParamsReducible,
    Mode, SectionsSettings,
    Entity
} from "../EntityExplorationState";

import ExplorationParamsActions from "./ExplorationParamsActions";
import AuthActions from "../../auth/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";

const initialState: ExplorationParamsReducible = {
    entity: Entity.PERSONS,
    sectionsSettings: {
        PERSONS: Mode.FIND_BY_FULL_NAME,
        JUR_PERSONS: Mode.FIND_BY_ID,
        USERS: Mode.FIND_BY_FULL_NAME
    },
    input: {
        [Entity.PERSONS]: {...new BasicHumanSearchInputInit()},
        [Entity.USERS]: {...new BasicHumanSearchInputInit()},
        [Entity.JUR_PERSONS]: {id: ""}
    }
}

const explorationParamsReducer: Reducer<ExplorationParamsReducible, PayloadAction<ExplorationParams>> = (prev=initialState, action) => {
    switch (action.type) {
        case ExplorationParamsActions.UPDATE_EXPLORATION_PARAMS:
            return {...prev,...action.payload};

        case ExplorationParamsActions.UPDATE_SECTION_PARAMS:
            return {...prev, sectionsSettings: {...(prev!.sectionsSettings as SectionsSettings), ...action.payload}};

        case ExplorationParamsActions.CLEAR_EXPLORATION_PARAMS:
            return initialState;

        case ExplorationParamsActions.SET_CURRENT_INPUT_DATA: {
            const input = action.payload as BasicHumanSearchPayload;

            return {...prev, input: {
                    ...prev?.input, [prev!.entity!]:  input
                }}
        }

        case AuthActions.CLEAR_AUTH: {
            return initialState
        }

        default: return prev;
    }
}

export default explorationParamsReducer