import Person, {Relationship} from "../../model/human/person/Person";
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
import {LitmusServiceContext} from "../App";
import {PersonsIdMap} from "../../service/relationships/RelationshipsScanServiceImpl";

type PersonMapProps = {
    person: Person,
    currentLocation: GeoLocation|null
}

function transformLocationToCoordinates (location: GeoLocation) {
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

function buildRelationshipLine({basePerson, relationship}: {relationship: Relationship, basePerson: Person}): {relationship: Relationship, basePerson: Person, line: Feature<LineString>} {
    if (basePerson.location) {
        const personCoordinates = transformLocationToCoordinates(basePerson.location!);

        const relatedPerson = relationship.to;
        if (relatedPerson.location) {
            const relatedPersonCoordinates = transformLocationToCoordinates(relatedPerson.location);

            const line = new Feature({
                geometry: new LineString([personCoordinates, relatedPersonCoordinates])
            })
            line.setStyle(lineStyle);

            return {
                relationship: relationship,
                basePerson: basePerson,
                line: line
            }
        } else throw new Error("related person has no location")
    } else throw new Error("base person has no location")
}

function drawRelationshipsLines ({person, map}: {person: Person, map: OlMap}) {
    const source = new Vector<LineString>({
    });

    const vectorLayer = new VectorLayer({
        source: source,
        renderBuffer: 1e6
    });

    const processedRelationships: Relationship[] = [];

    person
        .relationshipsInfo
        .relationships
        .forEach(relationShip=>{
            if (person.location) {
                const lineData = buildRelationshipLine({basePerson: person, relationship: relationShip});
                processedRelationships.push(relationShip);
                source.addFeature(lineData.line);
                console.log(lineData)
            }
            const relatedPerson = relationShip.to;
            if (relatedPerson.location&&relatedPerson.relationshipsInfo.relationships) {
                relatedPerson.relationshipsInfo.relationships.forEach(internalRelationship => {
                    if (internalRelationship.to.location) {
                        if (!processedRelationships.some(r=>isSameRelationship(r, internalRelationship))) {
                            if (person.relationshipsInfo.relationships.some(r=>r.to.id===internalRelationship.to.id)) {
                                const lineData = buildRelationshipLine({basePerson: relatedPerson, relationship: internalRelationship});
                                processedRelationships.push(internalRelationship);
                                source.addFeature(lineData.line)
                            }
                        }
                    }
                })
            }
        })

    map.addLayer(vectorLayer);
    console.log(source.getFeatures())
}

const PersonMap = ({person, currentLocation}: PersonMapProps) => {
    const mapTargetElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<OlMap | undefined>();
    const [personsLabels, setPersonsLabels] = useState<PersonLabelInfo[]>([])

    const relationshipsScanService = useContext(LitmusServiceContext).relationshipsScanService;

    useEffect(()=>{
        const shared: PersonsIdMap = new Map<string, Person>();
        const map = relationshipsScanService.recursiveScan(person, {
            scanned: new Map(),
            shared
        },0
        ,6);
        console.log(map)
        relationshipsScanService.buildPairedRelationshipsMap(map.shared).then(console.log)
    }, [person])

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

    useEffect(()=>{
        if (map) {
            const processedLabels: PersonLabelInfo[] = [];

            if (person.location) {
                const labelData = addPersonGeoToMap({person, map, cssAnchor: "main"})
                processedLabels.push(labelData)
            }

            const relLabels = person
                .relationshipsInfo
                .relationships
                .filter(rel=>rel.to.location)
                .map(rel=>addPersonGeoToMap({
                    person: rel.to,
                    map: map
                }));

            processedLabels.push(...relLabels);

            setPersonsLabels(processedLabels);
            drawRelationshipsLines({person: person, map: map});
        }
    }, [map])

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