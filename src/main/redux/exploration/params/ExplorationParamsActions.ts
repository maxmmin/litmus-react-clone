import {ExplorationParams, Mode, Entity} from "../explorationParams";
import {BasicHumanSearchPayload} from "../explorationParams";

enum ExplorationParamsActions  {
    UPDATE_EXPLORATION_PARAMS="UPDATE_EXPLORATION_PARAMS",
    CLEAR_EXPLORATION_PARAMS="CLEAR_EXPLORATION_PARAMS",
    SET_CURRENT_INPUT_DATA="SET_CURRENT_INPUT_DATA",
    UPDATE_SECTION_PARAMS="UPDATE_SECTION_PARAMS"
}

export default ExplorationParamsActions;

const updateExplorationParams = (payload: Partial<ExplorationParams>) => ({
        type: ExplorationParamsActions.UPDATE_EXPLORATION_PARAMS,
        payload:  payload
    })

export const updateSectionExplorationParams = (payload: Partial<Record<Entity, Mode>>) => ({
        type: ExplorationParamsActions.UPDATE_SECTION_PARAMS,
        payload:  payload
    })


export const setLocalInput = <T extends BasicHumanSearchPayload>(input: T) => ({
    type: ExplorationParamsActions.SET_CURRENT_INPUT_DATA,
    payload: input
})

export {updateExplorationParams}
