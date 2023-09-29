import Person, {getFullName, Relationship} from "../../model/human/person/Person";
import {useEffect, useRef, useState} from "react";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {View} from "ol";
import {FullScreen, Zoom} from "ol/control";
import {RelationshipComponent} from "./PersonComponent";

type PersonMapProps = {
    person: Person
}

type PersonMapRelationshipItemProps = {
    relationship: Relationship
}

const PersonMapRelationshipItem = ({relationship}: PersonMapRelationshipItemProps) => {
    return (
        <div className="person-map__person-relationship-wrapper">
            <RelationshipComponent relationship={relationship}/>
        </div>
    )
}

const PersonMap = ({person}: PersonMapProps) => {
    const mapTargetElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<Map | undefined>();

    useEffect(()=>{
        if (mapTargetElement.current) {
            const olMap = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    center: [0,0],
                    zoom: 17
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

            setMap(olMap);

            console.log("map has been initialized")

        }
    }, [mapTargetElement])

    return (
        <div ref={mapTargetElement} className="person-map">
            <div className="person-map__person-relationships">
                {person.}
            </div>
        </div>
    )
}

export default PersonMap;