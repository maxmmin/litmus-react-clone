import {
    Modes,
    modesDataSource, Tables
} from "../../types/explorationParams";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateExplorationParams, updateSectionExplorationParams} from "../../redux/actions/ExplorationParamsActions";


const ExplorationModesView = () => {
    const dispatch = useAppDispatch();

    const exploredTable = useAppSelector(state => state.explorationParams?.table);

    const explorationMode = useAppSelector(state => state.explorationParams?.sectionsSettings![exploredTable!])

    const modes = useMemo(()=>{
        if (exploredTable) {
            return Object.entries(modesDataSource[exploredTable])
        }
        return null;
    },[exploredTable])

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const mode = event.currentTarget.value as Modes;
        dispatch(updateSectionExplorationParams({[exploredTable!]: mode}))
    }

    useEffect(()=>{
        if (exploredTable) {
            if (!explorationMode) {
                dispatch(updateExplorationParams({
                    [exploredTable]: Object.keys(modesDataSource[exploredTable!])[0]
                }))
            }
        }
    },[exploredTable])


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