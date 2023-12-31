import {LabelInfo, LocationPresent, RelationsLabelsMetaData} from "../../util/map/MapPainter";
import {GeoLocationPinDropIcon} from "../assets/icons";
import React, {useContext, useEffect, useRef, useState} from "react";
import OlMap from "ol/Map";
import {defaultMapPosition, transformLocationToCoordinates} from "../../util/map/mapUtilites";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {View} from "ol";
import {FullScreen, Zoom} from "ol/control";
import {checkNotEmpty} from "../../util/pureFunctions";
import {GeoLocation} from "../../model/GeoLocation";

import '../assets/styles/map.scss'
import '../assets/styles/entityPage/entityMap.scss'
import {LitmusServiceContext} from "../App";
import {ObjectEvent} from "ol/Object";
import BaseEvent from "ol/events/Event";

type Props = {
    metadata: RelationsLabelsMetaData,
    currentlyDisplayed: CurrentlyDisplayed,
    cssAnchor?: string
}

export type CurrentlyDisplayed = {
    to: LocationPresent<LocationContainable>
}

export type LocationContainable = {
    id: number,
    location: GeoLocation
}

const defaultZoom: number = 17;

const resizeMapCallback = ({map, labels}: {map: OlMap, labels: HTMLDivElement[]}) => {
    let scale = 100/(map.getView().getResolution()!);
    console.log("resize")

    const minScale = 0.01;
    const maxScale = 1;

    labels.forEach(label=>{
        if (scale>maxScale) {
            scale = maxScale;
        } else if (scale<minScale) scale=minScale;
        label.style.transform = `scale(${Math.pow(scale, 1/3)})`
    })
}


export default function RelationsMap ({metadata, currentlyDisplayed, cssAnchor}: Props) {
    const mapTargetElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<OlMap | undefined>();
    const [lastIndex, setLastIndex] = useState<number>(1);
    const [displayed, setDisplayed] = useState<LocationContainable|null>(currentlyDisplayed.to);
    const [firstShown] = useState<LocationContainable>(currentlyDisplayed.to);

    const painter = useContext(LitmusServiceContext).map.mapPainter;

    useEffect(()=>{
        if (map) {
            painter.putOnMap(metadata, map);
            return ()=>{
                painter.removeFromMap(metadata, map);
            }
        }
    }, [metadata, map])

    useEffect(() => {
        setDisplayed(currentlyDisplayed.to);
    }, [currentlyDisplayed]);

    useEffect(()=>{
        if (map&&displayed) {
            const coordinates = transformLocationToCoordinates(displayed.location);

            const labels: LabelInfo<LocationContainable>[] = [...metadata.drawnPersons, ...metadata.drawnJurPersons];

            const selected = checkNotEmpty(labels.find(l=>l.entity.id===displayed.id));

            checkNotEmpty(selected.label.parentElement).style.zIndex = lastIndex+1+"";
            setLastIndex(prev=>prev+1);

            const view = map.getView();

            view.setCenter(coordinates);
            view.setZoom(defaultZoom);
        }
    }, [displayed, map])

    useEffect(()=>{
        if (map) {
            const labels: LabelInfo<LocationContainable>[] = [...metadata.drawnPersons, ...metadata.drawnJurPersons];
            const resizeCallback = ()=>{
                resizeMapCallback({map: map, labels: labels.map(l=>l.label)})
            }

            map.getView().on("change:resolution", resizeCallback);

            resizeCallback();

            return ()=>map.getView().un("change:resolution", resizeCallback);
        }
    }, [map, metadata])

    useEffect(()=>{
        if (map) {
            const callback = (_e: BaseEvent|Event) => {if (displayed) setDisplayed(null);}
            map.getView().on(['change:center', 'change:resolution'], callback);
            return ()=>map.getView().un(['change:center', 'change:resolution'], callback);
        }
    }, [map, displayed])

    useEffect(()=>{
        if (mapTargetElement.current) {
            const center = transformLocationToCoordinates({address: "", longitude: defaultMapPosition.lng, latitude: defaultMapPosition.lat});

            const olMap = new OlMap({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    center: center,
                    zoom: defaultZoom
                }),
                controls: [
                    new FullScreen({
                        className: 'map-fullscreen-btn',
                        label: '\u26F6',
                        labelActive: '\u2716'
                    }),
                    new Zoom({
                        className: 'map-zoom'
                    })
                ]
            });

            olMap.setTarget(mapTargetElement.current);

            setMap(olMap)

            console.log("map has been initialized")

        }
    }, [mapTargetElement])

    useEffect(()=>{
        return ()=>{
            map?.dispose();
        }
    }, [map])
    //@todo pindrop icon
    return (
        <div ref={mapTargetElement} className={`entity-map ${cssAnchor||""}`}>
            <div className="map__geo-btn-wrapper" onClick={()=>{
                setDisplayed(firstShown);
            }}>
                <GeoLocationPinDropIcon className={"map__geo-btn"}/>
            </div>
        </div>
    )
}