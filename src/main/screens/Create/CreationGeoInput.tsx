import { OpenStreetMapProvider } from 'leaflet-geosearch';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {SearchResult} from "leaflet-geosearch/lib/providers/provider";
import {RawResult} from "leaflet-geosearch/lib/providers/openStreetMapProvider";
import LoaderSpinner from "../components/LoaderSpinner";
import {Tables} from "../../types/explorationParams";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateCreationParams, updateJurPersonCreationParams} from "../../redux/actions/CreationParamsActions";

type Props = {
    table: Tables
}

const CreationGeoInput = ({table}: Props) => {
    const dispatch = useAppDispatch()

    const place = useAppSelector(state => {
        switch (table) {
            case Tables.JUR_PERSONS: {
                return state.creationParams?.jurPersonCreationData.address
            }
        }
    })

    const [timerId, setTimerId] = useState<NodeJS.Timer|null>(null)

    const provider = useMemo(() => new OpenStreetMapProvider(), [])
    
    const [completeItems, setCompleteItems] = useState<SearchResult<RawResult>[]>([])

    const [pending, setPending] = useState<boolean>(false)

    const [show, setShow] = useState<boolean>(false)

    const input = useRef<HTMLInputElement>(null)

    const [inputValue, setInputValue] = useState<string>("")

    const itemOnClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const newPlace = JSON.parse(e.currentTarget.getAttribute("value")!) as unknown as SearchResult<RawResult>
        setInputValue(newPlace.label)
        setShow(false)

        switch (table) {
            case Tables.JUR_PERSONS: {
                    dispatch(updateJurPersonCreationParams({address: {
                        longitude: newPlace.x,
                        latitude: newPlace.y,
                        label: newPlace.label
                    }
                }))
            }
        }
    }

    useEffect(() => {
            const windowOnClick = () => {
                if (show) {
                    setShow(false)
                    if (!place) {
                        setInputValue("")
                    }
                    input.current!.blur();
                }
            }

            window.addEventListener("click", windowOnClick)

            return () => {
                window.removeEventListener("click", windowOnClick)
            }
        }, [show])

    useEffect(()=>{
        if (place) {
            setInputValue(place.label)
        }
    }, [])


    return (
        <div className={"geo-autocomplete"} onClick={e=>e.stopPropagation()}>
            <input placeholder={"Введіть та оберіть адресу"} value={inputValue} onFocus={()=>setShow(true)} ref={input} type="text" className={"form-control"}
                   onInput={(e)=>{

                       if (timerId) {
                           clearTimeout(timerId)
                       }

                       const newValue = e.currentTarget.value

                        setInputValue(newValue)

                        setPending(true)

                        const address = e.currentTarget.value;


                        let timer = setTimeout(async ()=>{
                            const results = await provider.search({ query: address }).catch(e=>{
                                console.log(e)
                                setPending(false)
                                return []
                            });

                            setCompleteItems(results.slice(0,5))

                            setPending(false)
                        }, 200)

                        setTimerId(timer)
                    }}
                    onBlur={(e)=>{
                        if (place&&inputValue!==place.label) {
                            setInputValue("")
                            switch (table) {
                                case Tables.JUR_PERSONS: {
                                    dispatch(updateJurPersonCreationParams({address: null}))
                                }
                            }
                        }
                    }}
            />

            {pending ?
                <div className="loader-container loader-container__address">
                    <LoaderSpinner/>
                </div>
                :   null}

            {show?
                    <ul className="autocomplete-items">
                        {
                            completeItems.map(el=>{
                                return <li onClick={itemOnClick}
                                value={JSON.stringify(el)} className={"autocomplete-items__item"} key={el.x+el.y}>{el.label}</li>
                             })
                        }
                    </ul>
                :
                null}
        </div>
    )
}

export default CreationGeoInput;