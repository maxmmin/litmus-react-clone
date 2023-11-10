import React from "react";
import {RelationsLabelsMetaData} from "../../../util/map/MapPainter";
import RelationsMap, {CurrentlyDisplayed} from "../RelationsMap";


export type PersonMapProps = {
    metadata: RelationsLabelsMetaData,
    currentlyDisplayed: CurrentlyDisplayed
}


const PersonMap = ({metadata, currentlyDisplayed}: PersonMapProps) => {

    return (
        <RelationsMap metadata={metadata} currentlyDisplayed={currentlyDisplayed}/>
    )
}

export default PersonMap;