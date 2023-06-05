import Header from "../header/Header";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Entity} from "../../redux/exploration/Entity";
import ExplorationModesView from "./ExplorationModesView";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import Button from "react-bootstrap/Button";
import PrivateComponentWrapper from "../authorization/PrivateComponentWrapper";
import Role, {Permissions, RoleName} from "../../redux/userIdentity/Role";
import {NO_OUTPUT} from "../authorization/PrivateComponent";
import {useNavigate} from "react-router-dom";
import appConfig, {routingLinks} from "../../config/appConfig";
import {useLocation, useParams} from "react-router";
import InputGroup from "./InputGroup";

/* btn isInputInvalid?'disabled':''*/

// const search = (e: React.MouseEvent<HTMLButtonElement>, dispatch: AppDispatch) => {
//     e.preventDefault();
//
//     if (exploredEntity) {
//         dispatch(refreshResultsThunk({table: exploredEntity, shouldRefreshGlobally: false}))
//     }
// }

const ExplorationScreen = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate()

    const resultsContainer = useRef<HTMLDivElement>(null)

    const [exploredEntity, setExploredEntity] = useState<Entity|null>(null);

    const {entityDomain}: {entityDomain?: string} = useParams<{entityDomain: string}>();

    useLayoutEffect(() => {
        let entity: Entity|null = null;

        if (entityDomain) {

            Object.entries(appConfig.entityDomains).forEach(([key, value])=>{
                if (entityDomain===value) {
                    entity = Entity[key as Entity];
                }
            })

        }

        if (entity) {
            setExploredEntity(entity)
        } else {
            if (exploredEntity) {

            } else navigate(appConfig.applicationMappings.exploration.default);
        }
    }, [location])

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

    let requiredPermissions: Permissions[] = Role[RoleName.USER].permissions;
    {
        if (exploredEntity) {
            switch (exploredEntity) {
                case Entity.PERSON:
                    requiredPermissions = Role[RoleName.USER].permissions;
                    break;
                case Entity.JUR_PERSON:
                    requiredPermissions = Role[RoleName.USER].permissions;
                    break;
                case Entity.USER:
                    requiredPermissions = Role[RoleName.ADMIN].permissions;
                    break;
            }
        }
    }

    const scrollCallback = () => {
        // const results = (store.getState() as RootState).exploration;
        // if (resultsContainer.current&&results&&results?.partlyLoaded) {
        //     const rect: DOMRect = resultsContainer.current.getBoundingClientRect();
        //
        //     if (results&&!results.pending&&rect.height+rect.top<window.innerHeight+150) {
        //         dispatch(lazyLoadResultsThunk({results: results as ResultsFullRequired, shouldRefreshGlobally: false}))
        //     }
        // }
    }

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        navigate(event.currentTarget.value)
    }

    useEffect(()=>{
        window.addEventListener("scroll", scrollCallback)
        //@todo move scrollCallback outisde
        return () => {
            window.removeEventListener("scroll",scrollCallback)
        }
        /* eslint-disable-next-line */ // -f | scrollBack is  static function inside component and is not required in dependency list
    },[])

    if (!exploredEntity) {
        throw new Error("client error. table shouldn't be null. reload the page")
    }

    return (
       <PrivateComponentWrapper requiredPermissions={requiredPermissions} mode={"ERROR_PAGE"}>
           <div className={"explore-page"}>
               <Header backButtonPath={"/"}/>
               <main className={"explore-page__main"}>
                   <div className="explore-page__search">
                       <p style={{marginBottom: '10px'}}>Знайти</p>

                       <Form.Select className={"explore__select"} value={appConfig.entityDomains[exploredEntity!]} onChange={handleSelectChange}>
                           <option value={routingLinks.explore[Entity.PERSON]}>Фізичну особу</option>
                           <option value={routingLinks.explore[Entity.JUR_PERSON]}>Юридичну особу</option>
                           <PrivateComponentWrapper requiredPermissions={[Permissions.USERS_READ]} mode={NO_OUTPUT}>
                               <option value={routingLinks.explore[Entity.USER]}>Користувача</option>
                           </PrivateComponentWrapper>
                       </Form.Select>

                       <ExplorationModesView/>


                       {exploredEntity?
                           <>
                               <div className="explore-page__input-group-container">
                                   <Form className={"explore-input-group"}>

                                       {/*@todo this*/}
                                       {/*<InputGroup/>*/}

                                       <Button disabled={data?.isPending} onClick={()=>"search"} variant="primary" className={`w-100 py-2 mt-3 litmus-primary-btn`}>
                                           {data?.isPending?"Завантаження...":"Пошук"}
                                       </Button>
                                   </Form>
                               </div>
                           </>
                           : null
                       }


                   </div>

                   <InputGroup exploredEntity={exploredEntity}/>
                   {/*<ResultsContainer containerRef={resultsContainer}/>*/}
               </main>
           </div>
       </PrivateComponentWrapper>
    )
}

export default ExplorationScreen;