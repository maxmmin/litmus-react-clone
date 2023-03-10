import {ExplorationParams, Modes, Tables} from "../../types/explorationParams";
import {BasicHumanSearchPayload} from "../../types/explorationParams";
import {Action} from "redux";

enum ExplorationActions  {
    UPDATE_EXPLORATION_PARAMS="UPDATE_EXPLORATION_PARAMS",
    CLEAR_EXPLORATION_PARAMS="CLEAR_EXPLORATION_PARAMS",
    SET_CURRENT_INPUT_DATA="SET_CURRENT_INPUT_DATA",
    UPDATE_SECTION_PARAMS="UPDATE_SECTION_PARAMS"
}

export default ExplorationActions


const updateExplorationParams = (payload: Partial<ExplorationParams>) => ({
        type: ExplorationActions.UPDATE_EXPLORATION_PARAMS,
        payload:  payload
    })

export const updateSectionExplorationParams = (payload: Partial<Record<Tables, Modes>>) => ({
        type: ExplorationActions.UPDATE_SECTION_PARAMS,
        payload:  payload
    })


export const setLocalInput = <T extends BasicHumanSearchPayload>(input: T) => ({
    type: ExplorationActions.SET_CURRENT_INPUT_DATA,
    payload: input
})

export {updateExplorationParams}
