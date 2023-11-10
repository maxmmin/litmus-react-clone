import {JurPerson} from "../../model/jurPerson/JurPerson";
import {GeoBtnStateCssAnchor} from "./GeoBtnStateCssAnchor";
import RelatedJurPersonComponent from "./RelatedJurPersonComponent";
import {hasLocation} from "../../util/pureFunctions";
import React, {Dispatch, SetStateAction} from "react";
import Person from "../../model/human/person/Person";
import {RelationsLabelsMetaData} from "../../util/map/MapPainter";
import {CurrentlyDisplayed} from "./RelationsMap";
import RelatedPersonComponent from "./person/RelatedPersonComponent";

export function mapRelatedJurPerson (jurPerson: JurPerson, mapMetadata: RelationsLabelsMetaData|null,
                                     setDisplayedEntity: Dispatch<SetStateAction<CurrentlyDisplayed | null>>) {
        let geoBtnStateCssAnchor: GeoBtnStateCssAnchor = GeoBtnStateCssAnchor.NONE;

        if (mapMetadata) {
            if (jurPerson.location&&mapMetadata.drawnJurPersons.findIndex(j=>j.entity===jurPerson)>-1) {
                geoBtnStateCssAnchor = GeoBtnStateCssAnchor.ENABLED;
            } else geoBtnStateCssAnchor = GeoBtnStateCssAnchor.DISABLED;
        }

        return <RelatedJurPersonComponent key={jurPerson.id}
                                           jurPerson={jurPerson}
                                           cssAnchor={geoBtnStateCssAnchor}
                                           geoBtnOnClick={(j,_e)=>{
                                               if (geoBtnStateCssAnchor===GeoBtnStateCssAnchor.ENABLED&&hasLocation(j)) {
                                                   setDisplayedEntity({to: j});
                                               }
                                           }}
        />
}

export function mapRelatedPerson (possibleRelated: Person, mapMetadata: RelationsLabelsMetaData|null,
                                  setDisplayedEntity: Dispatch<SetStateAction<CurrentlyDisplayed | null>>) {
    let geoBtnStateCssAnchor: GeoBtnStateCssAnchor = GeoBtnStateCssAnchor.NONE;

    if (mapMetadata) {
        if (possibleRelated.location&&mapMetadata.drawnPersons.findIndex(p=>p.entity===possibleRelated)>-1) {
            geoBtnStateCssAnchor = GeoBtnStateCssAnchor.ENABLED;
        } else geoBtnStateCssAnchor = GeoBtnStateCssAnchor.DISABLED;
    }

    return <RelatedPersonComponent key={possibleRelated.id}
                                    person={possibleRelated}
                                    cssAnchor={geoBtnStateCssAnchor}
                                    geoBtnOnClick={(_p,_e)=>{
                                        if (geoBtnStateCssAnchor===GeoBtnStateCssAnchor.ENABLED&&hasLocation(possibleRelated)) {
                                            setDisplayedEntity({to: possibleRelated});
                                        }
                                    }}
    />
}