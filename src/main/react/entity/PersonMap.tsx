import Person from "../../model/human/person/Person";
import React, {useEffect, useRef, useState} from "react";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Feature, Overlay, View} from "ol";
import {FullScreen, Zoom} from "ol/control";
import {GeoLocation} from "../../model/GeoLocation";
import {defaultMapPosition, transformToTarget} from "../../util/mapUtil";
import {buildUrl} from "../../util/pureFunctions";
import appConfig from "../../config/appConfig";
import {Geometry, LineString, Point} from "ol/geom";
import {fromLonLat} from "ol/proj";
import {Vector as VectorLayer} from "ol/layer";
import Vector from "ol/source/Vector";
import {Fill, Stroke, Style} from "ol/style";

type PersonMapProps = {
    person: Person,
    currentLocation: GeoLocation|null
}

function transformLocationToCoordinates (location: GeoLocation) {
    const sourceCoordinates = {lng: location.longitude, lat: location.latitude};
    const targetCoordinates = transformToTarget(sourceCoordinates);
    return [targetCoordinates.lng, targetCoordinates.lat];
}

type PersonLabelData = Pick<Person, "firstName"|"middleName"|"lastName"|"location"|"media">;

function getPersonLabelElement({person, cssAnchor=""}: {person: PersonLabelData, cssAnchor?: string}): HTMLDivElement {
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

function addPersonGeoToMap({person, map, cssAnchor}: {
        person: PersonLabelData,
        map: Map,
        cssAnchor?: string
    }): HTMLDivElement {
    if (!person.location) throw new Error("person has no location")

    const coordinates = transformLocationToCoordinates(person.location);

    const personContainer = getPersonLabelElement({person: person, cssAnchor: cssAnchor});

    const label = new Overlay({
        element: personContainer,
        positioning: "center-center"
    });

    label.setMap(map);
    label.setPosition(coordinates);

    return personContainer;
}

const resizeMapCallback = ({map, labels}: {map: Map, labels: HTMLDivElement[]}) => {
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

function drawRelationshipsLines ({person, map}: {person: Person, map: Map}) {
    if (person.location) {
        const personCoordinates = transformLocationToCoordinates(person.location);

        const source = new Vector<LineString>({
        });

        const vectorLayer = new VectorLayer({
            source: source,
            renderBuffer: 1e6
        });

        const lineStyle = new Style({
            fill: new Fill({ color: '#6750A4' }),
            stroke: new Stroke({
                color: '#6750A4',
                width: 3,
            })
        });

        person.relationships.forEach(relationShip=>{
            const relatedPerson = relationShip.person;
            if (relatedPerson.location) {
                const relatedPersonCoordinates = transformLocationToCoordinates(relatedPerson.location);

                const line = new Feature({
                    geometry: new LineString([personCoordinates, relatedPersonCoordinates])
                })
                line.setStyle(lineStyle);

                source.addFeature(line);

                console.log(source.getFeatures())
            }
        })

        map.addLayer(vectorLayer);
        console.log(map.getLayers())
    }
}

const PersonMap = ({person, currentLocation}: PersonMapProps) => {
    const mapTargetElement = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<Map | undefined>();
    const [personsLabels, setPersonsLabels] = useState<HTMLDivElement[]>([])

    useEffect(()=>{
        if (mapTargetElement.current) {
            const center = transformLocationToCoordinates(currentLocation?currentLocation:
                {address: "", longitude: defaultMapPosition.lng, latitude: defaultMapPosition.lat});

            const olMap = new Map({
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
            const label = addPersonGeoToMap({person, map, cssAnchor: "main"});
            const relLabels = person.relationships
                .filter(rel=>rel.person.location)
                .map(rel=>addPersonGeoToMap({
                    person: rel.person,
                    map: map
                }));
            setPersonsLabels(prev=>[...prev, label, ...relLabels]);
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
                resizeMapCallback({map: map, labels: personsLabels})
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