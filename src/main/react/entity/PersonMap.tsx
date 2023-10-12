import Person, {RawRelationshipsPerson, Relationship} from "../../model/human/person/Person";
import React, {useContext, useEffect, useRef, useState} from "react";
import OlMap from "ol/Map";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Feature, Overlay, View} from "ol";
import {FullScreen, Zoom} from "ol/control";
import {GeoLocation} from "../../model/GeoLocation";
import {defaultMapPosition, transformToTarget} from "../../util/mapUtil";
import {buildUrl} from "../../util/pureFunctions";
import appConfig from "../../config/appConfig";
import {LineString} from "ol/geom";
import {Vector as VectorLayer} from "ol/layer";
import Vector from "ol/source/Vector";
import {Fill, Stroke, Style} from "ol/style";
import BasicPersonRelationshipsBinder from "../creation/person/BasicPersonRelationshipsBinder";
import BasicPersonRelationshipsLoader from "../creation/person/BasicPersonRelationshipsLoader";
import BasicRelationshipsResponseDtoScanner from "../creation/person/BasicRelationshipsResponseDtoScanner";
import PersonExplorationApiServiceImpl
    from "../../service/exploration/api/human/person/PersonExplorationApiServiceImpl";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";


type PersonMapProps = {
    person: RawRelationshipsPerson,
    currentLocation: GeoLocation|null
}

function transformLocationToCoordinates (location: GeoLocation): [number, number] {
    const sourceCoordinates = {lng: location.longitude, lat: location.latitude};
    const targetCoordinates = transformToTarget(sourceCoordinates);
    return [targetCoordinates.lng, targetCoordinates.lat];
}

type PersonLabelRequiredFields = Pick<Person, "id"|"firstName"|"middleName"|"lastName"|"location"|"media">;

function getPersonLabelElement({person, cssAnchor=""}: {person: PersonLabelRequiredFields, cssAnchor?: string}): HTMLDivElement {
    const personContainer = document.createElement("div");
    personContainer.className = "person-map-label "+cssAnchor;

    const imgContainer = document.createElement("div")
    imgContainer.className = 'person-map-label__img-wrapper'

    personContainer.append(imgContainer);

    const mainImg = person.media.mainImage;

    if (mainImg) {
        const personImg = document.createElement("img");
        personImg.src = buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg);
        personImg.className = "person-map-label__img"
        imgContainer.append(personImg);
    }

    return personContainer;
}

type PersonLabelInfo = {person: PersonLabelRequiredFields, label: HTMLDivElement}
function addPersonGeoToMap({person, map, cssAnchor}: {
        person: PersonLabelRequiredFields,
        map: OlMap,
        cssAnchor?: string
    }): PersonLabelInfo {
    if (!person.location) throw new Error("person has no location")

    const coordinates = transformLocationToCoordinates(person.location);

    const personContainer = getPersonLabelElement({person: person, cssAnchor: cssAnchor});

    const label = new Overlay({
        element: personContainer,
        positioning: "center-center"
    });

    label.setMap(map);
    label.setPosition(coordinates);

    return {
        label: personContainer,
        person: person
    };
}

const resizeMapCallback = ({map, labels}: {map: OlMap, labels: HTMLDivElement[]}) => {
    let scale = 100/(map.getView().getResolution()!);

    const minScale = 0.01;
    const maxScale = 1;

    labels.forEach(label=>{
        if (scale>maxScale) {
            scale = maxScale;
        } else if (scale<minScale) scale=minScale;
        label.style.transform = `scale(${Math.pow(scale, 1/3)})`
    })
}

const isSameRelationship = (srcRelationship: Relationship, targetRelationShip: Relationship) => {
    return srcRelationship.to.id===targetRelationShip.to.id;
}

const lineStyle = new Style({
    fill: new Fill({ color: '#6750A4' }),
    stroke: new Stroke({
        color: '#6750A4',
        width: 3,
    })
});

// function buildRelationshipLine({pair}: {pair: PairedRelationshipsFullInfo}): {pair: PairedRelationshipsFullInfo, line: Feature<LineString>} {
//     const personPair = pair.map(r=>r.to);
//     const [personOne, personTwo] = personPair;
//     if (personOne.location&&personTwo.location) {
//         const pairCoordinates: [number, number][] = personPair.map(p=>transformLocationToCoordinates(p.location!))
//
//
//         const line = new Feature({
//             geometry: new LineString(pairCoordinates)
//         })
//         line.setStyle(lineStyle);
//
//             return {
//                 pair: pair,
//                 line: line
//             }
//     } else throw new Error("one of persons has no location: "+JSON.stringify(personPair))
// }
//
// function drawRelationshipsLines ({pairedRelationshipsMap, map}: {pairedRelationshipsMap: PairedRelationshipMap, map: OlMap}) {
//     const source = new Vector<LineString>({
//     });
//
//     const vectorLayer = new VectorLayer({
//         source: source,
//         renderBuffer: 1e6
//     });
//
//     const pairData = Array
//         .from(pairedRelationshipsMap.entries())
//         .filter(([_, [r1,r2]])=>r1.to.location&&r2.to.location)
//         .map(([_, pair])=>{
//             return buildRelationshipLine({pair})
//         })
//
//     const lines = pairData.map(data=>data.line)
//
//     source.addFeatures(lines)
//     map.addLayer(vectorLayer);
// }

const PersonMap = ({person, currentLocation}: PersonMapProps) => {
    const mapTargetElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<OlMap | undefined>();

    const [personsLabels, setPersonsLabels] = useState<PersonLabelInfo[]>([])

    useEffect(()=>{
        const scanner = new BasicRelationshipsResponseDtoScanner();
        const loader = new BasicPersonRelationshipsLoader(scanner, PersonExplorationApiServiceImpl.getInstance(),PersonDtoMapperImpl.getInstance())
        const binder = new BasicPersonRelationshipsBinder(loader, scanner, PersonDtoMapperImpl.getInstance());
        binder.bindShared(person, -1).then(console.log)
        // binder.bindShared(person, -1).then(console.log);
    }, [])

    useEffect(()=>{
        if (mapTargetElement.current) {
            const center = transformLocationToCoordinates(currentLocation?currentLocation:
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

            setMap(olMap)

            console.log("map has been initialized")

        }
    }, [mapTargetElement])

    // useEffect(()=>{
    //     if (map&&sharedPersons) {
    //         const processedLabels: PersonLabelInfo[] = [];
    //
    //         const sharedPersonsArray: Person[] = Array.from(sharedPersons.entries()).map(entry=>entry[1]);
    //
    //         // if (person.location) {
    //         //     const labelData = addPersonGeoToMap({person, map, cssAnchor: "main"})
    //         //     processedLabels.push(labelData)
    //         // }
    //
    //         const relLabels = sharedPersonsArray
    //             .filter(person=>person.location)
    //             .map(p=>addPersonGeoToMap({
    //                 person: p,
    //                 cssAnchor: p.id===person.id?"main":undefined,
    //                 map: map
    //             }));
    //
    //         processedLabels.push(...relLabels);
    //
    //         setPersonsLabels(processedLabels);
    //
    //         relationshipsScanService
    //             .buildPairedRelationshipsMap(sharedPersons)
    //             .then(pairs => {
    //                 console.log(pairs)
    //                 drawRelationshipsLines({pairedRelationshipsMap: pairs, map: map});
    //             })
    //     }
    // }, [map, sharedPersons])


    useEffect(()=>{
        if (map) {
            const coordinates = transformLocationToCoordinates(currentLocation?currentLocation:
                {address: "", longitude: defaultMapPosition.lng, latitude: defaultMapPosition.lat});
            map.getView().setCenter(coordinates);
        }
    }, [currentLocation])

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

    return (
        <div ref={mapTargetElement} className="person-map">
        </div>
    )
}

export default PersonMap;