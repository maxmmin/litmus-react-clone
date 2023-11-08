import RipeJurPersonUtil from "./RipeJurPersonUtil";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import Person from "../../model/human/person/Person";
import {LocationPresent} from "../map/MapPainter";
import {hasLocation, hasValue} from "../pureFunctions";
import RipePersonUtil from "../person/RipePersonUtil";
import BasicRipePersonUtil from "../person/BasicRipePersonUtil";

export default class BasicRipeJurPersonUtil implements RipeJurPersonUtil {

    public static getInstance(ripePersonUtil: RipePersonUtil = BasicRipePersonUtil.getInstance()): BasicRipeJurPersonUtil {
        return new BasicRipeJurPersonUtil(ripePersonUtil);
    }
    constructor(protected readonly ripePersonUtil: RipePersonUtil) {
    }

    extractGeoRelatedPersons(jurPerson: JurPerson): Set<LocationPresent<Person>> {
        const ignoreList: LocationPresent<Person>[] = [jurPerson.benOwner, jurPerson.owner].filter(hasValue).filter(hasLocation);
        if (ignoreList.length>0) {

        }
        const entrySet: Set<LocationPresent<Person>> = new Set([...this._extractRelatedWithGeoCheck(jurPerson)].filter(hasLocation));
        return this.ripePersonUtil.filterForGeoRelatedPersons(entrySet, new Set(ignoreList));
    }

    // this method won't extract persons from branch if root entity has no location
    private _extractRelatedWithGeoCheck(jurPerson: JurPerson): Set<Person> {
        const resultArr: Person[] = [];
        if (jurPerson.owner&&jurPerson.owner.location) {
            resultArr.push(jurPerson.owner);
            resultArr.push(...this.ripePersonUtil.extractRelatedPersons(jurPerson.owner));
        }
        if (jurPerson.benOwner&&jurPerson.benOwner.location) {
            resultArr.push(jurPerson.benOwner)
            resultArr.push(...this.ripePersonUtil.extractRelatedPersons(jurPerson.benOwner));
        }
        return new Set(resultArr);
    }

    extractRelatedPersons(jurPerson: JurPerson): Set<Person> {
        const resultArr: Person[] = [];
        if (jurPerson.owner) {
            resultArr.push(jurPerson.owner);
            resultArr.push(...this.ripePersonUtil.extractRelatedPersons(jurPerson.owner));
        }
        if (jurPerson.benOwner) {
            resultArr.push(jurPerson.benOwner)
            resultArr.push(...this.ripePersonUtil.extractRelatedPersons(jurPerson.benOwner));
        }
        return new Set(resultArr);
    }

}