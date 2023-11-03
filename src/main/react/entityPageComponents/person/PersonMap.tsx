import Person from "../../../model/human/person/Person";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
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
import MapPainter, {LabelInfo, LocationPresent} from "../../../util/map/MapPainter";
import {checkNotEmpty} from "../../../util/pureFunctions";
import {GeoLocationPinDropIcon} from "../../assets/icons";
import RelationsMap, {CurrentlyDisplayed, LocationContainable} from "../RelationsMap";
import {ServiceContext} from "../../serviceContext";
import {LitmusServiceContext} from "../../App";


export type PersonMapProps = {
    person: LocationPresent<Person>,
    currentlyDisplayed: CurrentlyDisplayed
}




const PersonMap = ({person, currentlyDisplayed}: PersonMapProps) => {
    const context: ServiceContext = useContext(LitmusServiceContext);
    const painter: MapPainter = context.mapPainter;
    const metadata = useMemo(()=>painter.buildPersonMetadata(person), [person])
    return (
        <RelationsMap metadata={metadata} currentlyDisplayed={currentlyDisplayed}/>
    )
}

export default PersonMap;