import RipeJurPersonUtil from "./RipeJurPersonUtil";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import Person from "../../model/human/person/Person";
import {LocationPresent} from "../map/MapPainter";
import {hasLocation, hasValue} from "../pureFunctions";
import RipePersonUtil from "../person/RipePersonUtil";

export default class BasicRipeJurPersonUtil implements RipeJurPersonUtil {

    constructor(protected readonly ripePersonUtil: RipePersonUtil) {
    }

    extractGeoRelatedPersons(jurPerson: JurPerson): Set<Person> {
        const ignoreList: LocationPresent<Person>[] = [jurPerson.benOwner, jurPerson.owner].filter(hasValue).filter(hasLocation);
        const entrySet: Set<LocationPresent<Person>> = new Set([...this.extractRelatedPersons(jurPerson)].filter(hasLocation));
        return this.ripePersonUtil.filterForGeoRelatedPersons(entrySet, new Set(ignoreList));
    }

    extractRelatedPersons(jurPerson: JurPerson): Set<Person> {
        const resultArr: Person[] = [];
        if (jurPerson.owner) {
            resultArr.push(...this.ripePersonUtil.extractRelatedPersons(jurPerson.owner));
        }
        if (jurPerson.benOwner) {
            resultArr.push(...this.ripePersonUtil.extractRelatedPersons(jurPerson.benOwner));
        }
        return new Set(resultArr);
    }

}