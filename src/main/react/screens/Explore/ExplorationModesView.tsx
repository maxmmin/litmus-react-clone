import {
    Mode,
    modesDataSource
} from "../../../redux/exploration/explorationParams";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {updateExplorationParams, updateSectionExplorationParams} from "../../../redux/exploration/params/ExplorationParamsActions";
import store from "../../../redux/store";


const ExplorationModesView = () => {
    const dispatch = useAppDispatch();

    const exploredEntity = useAppSelector(state => state.explorationParams?.entity);

    const explorationMode = useAppSelector(state => state.explorationParams?.sectionsSettings![exploredEntity!])

    const modes = Object.entries(modesDataSource[exploredEntity!]);

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const mode = event.currentTarget.value as Mode;
        dispatch(updateSectionExplorationParams({[exploredEntity!]: mode}))
    }

    useEffect(()=>{
        if (exploredEntity&&explorationMode) {
            store.dispatch(updateExplorationParams({
                [exploredEntity]: Object.keys(modesDataSource[exploredEntity!])[0]
            }))
        }
    },[exploredEntity, explorationMode])


    if (modes&&explorationMode) {
        return (
            <>
                <p style={{marginBottom: '10px'}}>Пошук за:</p>

                <Form.Select className="explore__select" value={explorationMode} onChange={handleSelectChange}>
                    {modes.map(([key, {title}], index)=>
                        <option key={index} value={key}>{title}</option>)
                    }
                </Form.Select>
            </>
        )
    }
    return null;
}

export default ExplorationModesView;