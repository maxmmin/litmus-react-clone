import React, {useContext, useMemo} from "react";
import {LocationPresent, RelationsLabelsMetaData} from "../../../util/map/MapPainter";
import RelationsMap, {CurrentlyDisplayed} from "../RelationsMap";
import {ServiceContext} from "../../serviceContext";
import {LitmusServiceContext} from "../../App";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonMapTool from "../../../util/map/jurPerson/JurPersonMapTool";


export type JurPersonMapProps = {
    metadata: RelationsLabelsMetaData,
    currentlyDisplayed: CurrentlyDisplayed
}


const JurPersonMap = ({metadata, currentlyDisplayed}: JurPersonMapProps) => {

    return (
        <RelationsMap metadata={metadata} currentlyDisplayed={currentlyDisplayed}/>
)
}

export default JurPersonMap;