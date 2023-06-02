import Header from "../header/Header";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect, useLayoutEffect, useMemo, useRef} from "react";
import {Entity} from "../../redux/exploration/EntityExplorationState";
import ExplorationModesView from "./ExplorationModesView";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateExplorationParams} from "../../../redux/exploration/params/ExplorationParamsActions";
import Button from "react-bootstrap/Button";
import InputGroup from "./InputGroup";
import {
    lazyLoadResultsThunk,
    refreshResultsThunk, ResultsFullRequired
} from "../../../redux/exploration/data/ExplorationDataActions";
import ResultsContainer from "./ResultsContainer";
import PrivateComponentWrapper from "../authorization/PrivateComponentWrapper";
import {Permissions} from "../../redux/userIdentity/Role";
import {NO_OUTPUT} from "../authorization/PrivateComponent";
import store, {AppDispatch, RootState} from "../../redux/store";
import {useNavigate} from "react-router-dom";
import {routingLinks} from "../../util/appConfig";
import {useLocation} from "react-router";
import {getTableNameFromLocation} from "../../util/pureFunctions";

/* btn isInputInvalid?'disabled':''*/

// const search = (e: React.MouseEvent<HTMLButtonElement>, dispatch: AppDispatch) => {
//     e.preventDefault();
//
//     if (exploredEntity) {
//         dispatch(refreshResultsThunk({table: exploredEntity, shouldRefreshGlobally: false}))
//     }
// }

const Explore = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate()

    const resultsContainer = useRef<HTMLDivElement>(null)

    const exploredEntity = useMemo<Entity|null>(()=>getTableNameFromLocation(location.pathname), [location])

    const data = useAppSelector(state => {
        if (exploredEntity) {
            switch (exploredEntity) {
                case Entity.PERSON:
                    return state.exploration.person?.data;
                case Entity.JUR_PERSON:
                    return state.exploration.jurPerson?.data;
                case Entity.USER:
                    return state.exploration.user?.data;
            }
        }   else return null;
    })

    const scrollCallback = () => {
        const results = (store.getState() as RootState).exploration;
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

    useLayoutEffect(() => {
        if (exploredEntity) {
            dispatch(updateExplorationParams({entity: exploredEntity}))
        }
        /* eslint-disable-next-line */ // -f | WE UPDATE EXPLORATION PARAMS ON URL CHANGE, NOT ENTITY
    }, [location])

    useEffect(()=>{
        window.addEventListener("scroll", scrollCallback)

        return () => {
            window.removeEventListener("scroll",scrollCallback)
        }
        /* eslint-disable-next-line */ // -f | scrollBack is  static function inside component and is not required in dependency list
    },[])

    if (!exploredEntity) {
        throw new Error("client error. table shouldn't be null. reload the page")
    }

    return (
        <div className={"explore-page"}>
            <Header backButtonPath={"/"}/>
            <main className={"explore-page__main"}>
                <div className="explore-page__search">
                    <p style={{marginBottom: '10px'}}>Знайти</p>

                    <Form.Select className={"explore__select"} value={routingLinks.explore[exploredEntity]} onChange={handleSelectChange}>
                        <option value={routingLinks.explore[Entity.PERSON]}>Фізичну особу</option>
                        <option value={routingLinks.explore[Entity.JUR_PERSON]}>Юридичну особу</option>
                        <PrivateComponentWrapper neededPermissions={[Permissions.USERS_READ, Permissions.USERS_WRITE]} mode={NO_OUTPUT}>
                            <option value={routingLinks.explore[Entity.USER]}>Користувача</option>
                        </PrivateComponentWrapper>
                    </Form.Select>

                    <ExplorationModesView/>


                    {exploredEntity?
                        <>
                            <div className="explore-page__input-group-container">
                                <Form className={"explore-input-group"}>

                                    <InputGroup/>

                                    <Button disabled={results?.pending} onClick={search} variant="primary" className={`w-100 py-2 mt-3 litmus-primary-btn`}>
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