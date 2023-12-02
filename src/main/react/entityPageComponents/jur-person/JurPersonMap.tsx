import React from "react";
import {RelationsLabelsMetaData} from "../../../util/map/MapPainter";
import RelationsMap, {CurrentlyDisplayed} from "../RelationsMap";


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