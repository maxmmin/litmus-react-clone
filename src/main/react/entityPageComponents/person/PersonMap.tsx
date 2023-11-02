import Person from "../../../model/human/person/Person";
import React, {useContext, useEffect, useRef, useState} from "react";
import OlMap from "ol/Map";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {View} from "ol";
import {FullScreen, Zoom} from "ol/control";
import {defaultMapPosition, transformLocationToCoordinates} from "../../../util/map/mapUtil";
import MapPainterImpl from "../../../util/map/MapPainterImpl";
import BasicRipePersonUtil from "../../../util/relationships/BasicRipePersonUtil";
import {Entity} from "../../../model/Entity";
import {GeoLocation} from "../../../model/GeoLocation";
import {LabelInfo, LocationPresent} from "../../../util/map/MapPainter";
import {checkNotEmpty} from "../../../util/pureFunctions";
import {GeoLocationPinDropIcon} from "../../assets/icons";

export type LocationContainable = {
    id: number,
    location: GeoLocation
}

export type PersonMapProps = {
    person: LocationPresent<Person>,
    currentlyDisplayed: LocationContainable
}

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

const defaultZoom: number = 17;

const PersonMap = ({person, currentlyDisplayed}: PersonMapProps) => {
    const mapTargetElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<OlMap | undefined>();
    const [labels, setLabels] = useState<LabelInfo<LocationContainable>[]>([]);
    const [lastIndex, setLastIndex] = useState<number>(0);

    useEffect(()=>{
        if (mapTargetElement.current) {
            const center = transformLocationToCoordinates(currentlyDisplayed?.location?currentlyDisplayed.location:
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
        if (map) {
            const service = new MapPainterImpl(BasicRipePersonUtil.getInstance());
            if (person.location) {

                const popup = service.popup;
                map.addOverlay(popup);

                const metadata = service.paintPersonData(person,map);
                const drawnPersons = metadata.drawnPersons;
                const drawnJurPersons = metadata.drawnJurPersons;
                const drawnElems: LabelInfo<LocationContainable>[] = [...drawnPersons, ...drawnJurPersons];
                setLabels(drawnElems)
            }

        }
    }, [map, person])

    useEffect(()=>{
        if (map) {
            const coordinates = transformLocationToCoordinates(currentlyDisplayed?.location?currentlyDisplayed?.location:
                {address: "", longitude: defaultMapPosition.lng, latitude: defaultMapPosition.lat});

            const selected = checkNotEmpty(labels.find(l=>l.entity.id===currentlyDisplayed.id));

            checkNotEmpty(selected.label.parentElement).style.zIndex = lastIndex+1+"";
            setLastIndex(prev=>prev+1);

            const view = map.getView();

            view.setCenter(coordinates);
            view.setZoom(defaultZoom);
        }
    }, [currentlyDisplayed])

    useEffect(()=>{
        if (map) {
            const resizeCallback = ()=>{
                resizeMapCallback({map: map, labels: labels.map(l=>l.label)})
            }

            map.getView().on("change:resolution", resizeCallback);

            resizeCallback();

            return ()=>map.getView().un("change:resolution", resizeCallback);
        }
    }, [map, labels])

    useEffect(()=>{
        return ()=>{
            map?.dispose();
        }
    }, [map])

    return (
        <div ref={mapTargetElement} className="entity-map entity-map_person">
            <div className="map__geo-btn-wrapper">
                <GeoLocationPinDropIcon className={"map__geo-btn-wrapper"}/>
            </div>
        </div>
    )
}

export default PersonMap;