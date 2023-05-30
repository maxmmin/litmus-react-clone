import Header from "../components/Header";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Entity} from "../../redux/exploration/explorationParams";
import ExplorationModesView from "./ExplorationModesView";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateExplorationParams} from "../../redux/exploration/params/ExplorationParamsActions";
import Button from "react-bootstrap/Button";
import InputGroup from "./InputGroup";
import ExplorationDataActions, {
    clearResults,
    lazyLoadResultsThunk,
    refreshResultsThunk, ResultsFullRequired
} from "../../redux/exploration/data/ExplorationDataActions";
import ResultsContainer from "./ResultsContainer";
import PrivateComponentWrapper from "../components/PrivateComponentWrapper";
import {Permissions} from "../../redux/userIdentity/Role";
import {NO_OUTPUT} from "../components/PrivateComponent";
import store, {RootState} from "../../redux/store";
import {useNavigate} from "react-router-dom";
import {routingLinks} from "../../util/appConfig";
import {useLocation} from "react-router";
import {getTableNameFromLocation} from "../../util/pureFunctions";

const Explore = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate()

    const resultsContainer = useRef<HTMLDivElement>(null)

    const table = useMemo<Entity|null>(()=>getTableNameFromLocation(location.pathname), [location])

    useLayoutEffect(() => {
        if (table) {
            dispatch(updateExplorationParams({entity: table}))
        }
    }, [location])

    useEffect(()=>{
        window.addEventListener("scroll", scrollCallback)

        return () => {
            window.removeEventListener("scroll",scrollCallback)
        }
    },[resultsContainer.current])

    const mode = useAppSelector(state =>  state.explorationParams?.sectionsSettings![table!])
    const isInputInvalid = useAppSelector(state => state.explorationParams?.isInvalid)
    const results = useAppSelector(state => state.searchResults)

    const search = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!isInputInvalid&&table) {
            dispatch(refreshResultsThunk({table: table, shouldRefreshGlobally: false}))
        }
    }

    const scrollCallback = () => {
        const results = (store.getState() as RootState).searchResults
        if (resultsContainer.current&&results&&results?.partlyLoaded) {
            const rect: DOMRect = resultsContainer.current.getBoundingClientRect();

            if (results&&!results.pending&&rect.height+rect.top<window.innerHeight+150) {
                dispatch(lazyLoadResultsThunk({results: results as ResultsFullRequired, shouldRefreshGlobally: false}))
            }
        }
    }

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        navigate(event.currentTarget.value)
    }

    if (!table) {
        throw new Error("client error. table shouldn't be null. reload the page")
    }

    return (
        <div className={"explore-page"}>
            <Header backButtonPath={"/"}/>
            <main className={"explore-page__main"}>
                <div className="explore-page__search">
                    <p style={{marginBottom: '10px'}}>Знайти</p>

                    <Form.Select className={"explore__select"} value={routingLinks.explore[table]} onChange={handleSelectChange}>
                        <option value={routingLinks.explore[Entity.PERSONS]}>Фізичну особу</option>
                        <option value={routingLinks.explore[Entity.JUR_PERSONS]}>Юридичну особу</option>
                        <PrivateComponentWrapper neededPermissions={[Permissions.USERS_READ, Permissions.USERS_WRITE]} mode={NO_OUTPUT}>
                            <option value={routingLinks.explore[Entity.USERS]}>Користувача</option>
                        </PrivateComponentWrapper>
                    </Form.Select>

                    <ExplorationModesView/>


                    {table&&mode?
                        <>
                            <div className="explore-page__input-group-container">
                                <Form className={"explore-input-group"}>

                                    <InputGroup/>

                                    <Button disabled={results?.pending} onClick={search} variant="primary" className={`w-100 py-2 mt-3 litmus-primary-btn ${isInputInvalid?'disabled':''}`}>
                                        {results?.pending?"Завантаження...":"Пошук"}
                                    </Button>
                                </Form>
                            </div>
                        </>
                        : null
                    }


                </div>

                <ResultsContainer containerRef={resultsContainer}/>
            </main>
        </div>
    )
}

export default Explore;