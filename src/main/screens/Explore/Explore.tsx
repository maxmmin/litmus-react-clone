import Header from "../components/Header";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect} from "react";
import {Tables} from "../../types/explorationParams";
import ExplorationModesView from "./ExplorationModesView";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateExplorationParams} from "../../redux/actions/ExplorationParamsActions";
import Button from "react-bootstrap/Button";
import InputGroup from "./InputGroup";
import ApiSearchActions, {clearResults, refreshResultsThunk} from "../../redux/actions/ApiSearchActions";
import ResultsContainer from "./ResultsContainer";
import PrivateComponentWrapper from "../components/PrivateComponentWrapper";
import {Permissions} from "../../types/Role";
import {ForbiddenOutputCallbackModesEnum} from "../components/PrivateComponent";

const Explore = () => {

    const dispatch = useAppDispatch();

    const table = useAppSelector(state => state.explorationParams?.table)
    const mode = useAppSelector(state =>  state.explorationParams?.sectionsSettings![table!])
    const isInputInvalid = useAppSelector(state => state.explorationParams?.isInvalid)

    const search = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!isInputInvalid&&table) {
            dispatch(clearResults())
            dispatch(refreshResultsThunk({table: table, shouldRefreshGlobally: false}))
        }
    }

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const table: Tables = event.currentTarget.value as Tables;
        dispatch(updateExplorationParams({table: table}))
    }

    useEffect(()=>{
        window.addEventListener("scroll", () =>{
            
        })
    })

    return (
        <div className={"explore-page"}>
            <Header backButtonPath={"/"}/>
            <main className={"explore-page__main"}>
                <div className="explore-page__search">
                    <p style={{marginBottom: '10px'}}>Знайти</p>

                    <Form.Select className={"explore__select"} value={table} onChange={handleSelectChange}>
                        <option value={Tables.PERSONS}>Фізичну особу</option>
                        <option value={Tables.JUR_PERSONS}>Юридичну особу</option>
                        <PrivateComponentWrapper neededPermissions={[Permissions.USERS_READ, Permissions.USERS_WRITE]} mode={ForbiddenOutputCallbackModesEnum.NO_OUTPUT}>
                            <option value={Tables.USERS}>Користувача</option>
                        </PrivateComponentWrapper>
                    </Form.Select>

                    <ExplorationModesView/>


                    {table&&mode?
                        <>
                            <div className="explore-page__input-group-container">
                                <Form className={"explore-input-group"}>

                                    <InputGroup/>

                                    <Button onClick={search} variant="primary" className={`w-100 py-2 mt-3 litmus-primary-btn ${isInputInvalid?'disabled':''}`}>
                                        Пошук
                                    </Button>
                                </Form>
                            </div>
                        </>
                        : null
                    }


                </div>

                <ResultsContainer/>
            </main>
        </div>
    )
}

export default Explore;