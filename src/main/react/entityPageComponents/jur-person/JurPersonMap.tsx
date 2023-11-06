import React, {useContext, useMemo} from "react";
import {LocationPresent} from "../../../util/map/MapPainter";
import RelationsMap, {CurrentlyDisplayed} from "../RelationsMap";
import {ServiceContext} from "../../serviceContext";
import {LitmusServiceContext} from "../../App";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonMapTool from "../../../util/map/jurPerson/JurPersonMapTool";


export type JurPersonMapProps = {
    jurPerson: LocationPresent<JurPerson>,
    currentlyDisplayed: CurrentlyDisplayed
}


const JurPersonMap = ({jurPerson, currentlyDisplayed}: JurPersonMapProps) => {
    const context: ServiceContext = useContext(LitmusServiceContext);
    const mapTool: JurPersonMapTool = context.map.jurPersonMapTool;
    const metadata = useMemo(()=>mapTool.buildEntityMetadata(jurPerson), [jurPerson])
    return (
        <RelationsMap metadata={metadata} currentlyDisplayed={currentlyDisplayed}/>
)
}

export default JurPersonMap;