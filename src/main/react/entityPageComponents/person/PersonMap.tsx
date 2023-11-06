import Person from "../../../model/human/person/Person";
import React, {useContext, useMemo} from "react";
import MapPainter, {LocationPresent} from "../../../util/map/MapPainter";
import RelationsMap, {CurrentlyDisplayed} from "../RelationsMap";
import {ServiceContext} from "../../serviceContext";
import {LitmusServiceContext} from "../../App";
import PersonMapTool from "../../../util/map/person/PersonMapTool";


export type PersonMapProps = {
    person: LocationPresent<Person>,
    currentlyDisplayed: CurrentlyDisplayed
}


const PersonMap = ({person, currentlyDisplayed}: PersonMapProps) => {
    const context: ServiceContext = useContext(LitmusServiceContext);
    const mapTool: PersonMapTool = context.map.personMapTool;
    const metadata = useMemo(()=>mapTool.buildEntityMetadata(person), [person])
    return (
        <RelationsMap metadata={metadata} currentlyDisplayed={currentlyDisplayed}/>
    )
}

export default PersonMap;