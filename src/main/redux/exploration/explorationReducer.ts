import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {PersonExplorationParams, PersonExplorationState} from "./PersonExploration";
import {BasicEntityExplorationData, EntityExplorationData, ExplorationMode} from "./EntityExplorationState";
import {ExplorationTypedActions} from "./ExplorationManager";
import Person from "../../model/person/Person";

const initialPersonExplorationState = new PersonExplorationState(new BasicEntityExplorationData(), new PersonExplorationParams(ExplorationMode.BY_FULL_NAME));

const explorationPersonReducer: Reducer<PersonExplorationState, PayloadAction<any>> = (prevState=initialPersonExplorationState, action) => {
    const actions = ExplorationTypedActions.person;
    switch (action.type) {
        case actions.UPDATE_EXPLORATION_STATE: {
            return action.payload as PersonExplorationState;
        }
        case actions.UPDATE_EXPLORATION_DATA: {
            const newData = action.payload as EntityExplorationData<Person>;
            return {...prevState, data: newData};
        }
        case actions.UPDATE_EXPLORATION_PARAMS: {
            const params = action.payload as PersonExplorationParams;
            return {...prevState, params: params};
        }
        default: {
            return prevState;
        }
    }
}