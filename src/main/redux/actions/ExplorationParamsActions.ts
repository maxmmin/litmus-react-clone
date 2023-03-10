import {ExplorationParams} from "../../types/explorationParams";
import {BasicHumanSearchPayload} from "../../types/explorationParams";
import {Action} from "redux";

enum ExplorationActions  {
    UPDATE_EXPLORATION_PARAMS="UPDATE_EXPLORATION_PARAMS",
    CLEAR_EXPLORATION_PARAMS="CLEAR_EXPLORATION_PARAMS",
    SET_CURRENT_INPUT_DATA="SET_CURRENT_INPUT_DATA"
}

export default ExplorationActions

export type ExplorationAction = {
    type: string,
    payload: ExplorationParams
}

const updateExplorationParams = (payload: ExplorationParams) => ({
        type: ExplorationActions.UPDATE_EXPLORATION_PARAMS,
        payload:  payload
    })

export const setLocalInput = <T extends BasicHumanSearchPayload>(input: T) => ({
    type: ExplorationActions.SET_CURRENT_INPUT_DATA,
    payload: input
})

export {updateExplorationParams}
