import {
    Modes,
    modesDataSource, Tables
} from "../../types/explorationParams";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateExplorationParams} from "../../redux/actions/ExplorationParamsActions";


const ExplorationModesView = () => {
    const dispatch = useAppDispatch();

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const mode = event.currentTarget.value as Modes;
        dispatch(updateExplorationParams({mode: mode}))
    }

    const exploredTable = useAppSelector(state => state.explorationParams?.table);

    const explorationMode = useAppSelector(state => state.explorationParams?.mode)

    const results = useAppSelector(state => state.searchResults)

    const modes = useMemo(()=>{
        if (exploredTable) {
            return Object.entries(modesDataSource[exploredTable])
        }
        return null;
    },[exploredTable])

    useEffect(()=>{
        if (exploredTable) {
            if ((results&&!(results?.table===exploredTable)) || !explorationMode) {
                dispatch(updateExplorationParams({mode: Object.keys(modesDataSource[exploredTable!])[0] as Modes}))
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