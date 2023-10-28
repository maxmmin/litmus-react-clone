import Person from "../../../model/human/person/Person";
import React, {useContext, useEffect, useRef, useState} from "react";
import OlMap from "ol/Map";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {View} from "ol";
import {FullScreen, Zoom} from "ol/control";
import {GeoLocation} from "../../../model/GeoLocation";
import {defaultMapPosition, transformLocationToCoordinates} from "../../../util/map/mapUtil";
import {ServiceContext} from "../../serviceContext";
import {LitmusServiceContext} from "../../App";
import MapPainterImpl, {PersonLabelInfo} from "../../../util/map/MapPainterImpl";
import BasicRipePersonUtil from "../../../util/relationships/BasicRipePersonUtil";


type PersonMapProps = {
    person: Person,
    externalLocation: GeoLocation
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

const PersonMap = ({person, externalLocation}: PersonMapProps) => {
    const mapTargetElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<OlMap | undefined>();

    const [personsLabels, setPersonsLabels] = useState<PersonLabelInfo[]>([])

    const serviceContext: ServiceContext = useContext(LitmusServiceContext)

    const personRelationshipsUtil = serviceContext.personServices.ripePersonRelationshipsUtil;

    useEffect(()=>{
        if (mapTargetElement.current) {
            const center = transformLocationToCoordinates(externalLocation?externalLocation:
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

                setPersonsLabels([...metadata.drawnPersons])
            }

        }
    }, [map, person])


    useEffect(()=>{
        if (map) {
            const coordinates = transformLocationToCoordinates(externalLocation?externalLocation:
                {address: "", longitude: defaultMapPosition.lng, latitude: defaultMapPosition.lat});
            const view = map.getView();

            view.setCenter(coordinates);
            view.setZoom(defaultZoom);
        }
    }, [externalLocation])

    useEffect(()=>{
        if (map) {
            const resizeCallback = ()=>{
                resizeMapCallback({map: map, labels: personsLabels.map(l=>l.label)})
            }

            map.getView().on("change:resolution", resizeCallback);

            resizeCallback();

            return ()=>map.getView().un("change:resolution", resizeCallback);
        }
    }, [map, personsLabels])

    useEffect(()=>{
        return ()=>{
            map?.dispose();
        }
    }, [map])

    return (
        <div ref={mapTargetElement} className="person-map">
        </div>
    )
}

export default PersonMap;