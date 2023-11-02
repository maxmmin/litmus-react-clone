import {LabelInfo, RelationsLabelsMetaData} from "../../util/map/MapPainter";
import {GeoLocationPinDropIcon} from "../assets/icons";
import React, {useEffect, useRef, useState} from "react";
import OlMap from "ol/Map";
import {defaultMapPosition, transformLocationToCoordinates} from "../../util/map/mapUtil";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {View} from "ol";
import {FullScreen, Zoom} from "ol/control";
import {checkNotEmpty} from "../../util/pureFunctions";
import {GeoLocation} from "../../model/GeoLocation";

import '../assets/styles/map.scss'
import '../assets/styles/entityPage/entityMap.scss'

type Props = {
    metadata: RelationsLabelsMetaData,
    currentlyDisplayed: LocationContainable,
    cssAnchor?: string
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
    const [lastIndex, setLastIndex] = useState<number>(0);
    const [displayed, setDisplayed] = useState<LocationContainable>(currentlyDisplayed);
    const [firstShown] = useState<LocationContainable>(currentlyDisplayed);

    useEffect(() => {
        setDisplayed(currentlyDisplayed);
    }, [currentlyDisplayed]);

    useEffect(()=>{
        if (map) {
            const coordinates = transformLocationToCoordinates(currentlyDisplayed?.location?currentlyDisplayed?.location:
                {address: "", longitude: defaultMapPosition.lng, latitude: defaultMapPosition.lat});

            const labels: LabelInfo<LocationContainable>[] = [...metadata.drawnPersons, ...metadata.drawnJurPersons];

            const selected = checkNotEmpty(labels.find(l=>l.entity.id===currentlyDisplayed.id));

            checkNotEmpty(selected.label.parentElement).style.zIndex = lastIndex+1+"";
            setLastIndex(prev=>prev+1);

            const view = map.getView();

            view.setCenter(coordinates);
            view.setZoom(defaultZoom);
        }
    }, [displayed])

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
        if (mapTargetElement.current) {
            const center = transformLocationToCoordinates(currentlyDisplayed.location
                ||
                {address: "", longitude: defaultMapPosition.lng, latitude: defaultMapPosition.lat});

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