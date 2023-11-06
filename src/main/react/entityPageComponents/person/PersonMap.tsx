import Person from "../../../model/human/person/Person";
import React, {useContext, useMemo} from "react";
import MapPainter, {LocationPresent} from "../../../util/map/MapPainter";
import RelationsMap, {CurrentlyDisplayed} from "../RelationsMap";
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