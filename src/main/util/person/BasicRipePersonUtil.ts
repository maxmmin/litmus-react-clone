import Person from "../../model/human/person/Person";
import RipePersonUtil from "./RipePersonUtil";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {hasLocation, hasValue} from "../pureFunctions";
import {LocationPresent} from "../map/MapPainter";

export default class BasicRipePersonUtil implements RipePersonUtil{
    public static getInstance () {
        return new BasicRipePersonUtil();
    }

    private isLinkedByJurPerson (currentPerson: Person, relatedPersons: Person[]): boolean {
        let locationGeoRelationFlag: boolean = false;
        for (const owned of currentPerson.ownedJurPersons) {
            if (locationGeoRelationFlag) break;
            if (owned.location) {
                const benOwner = owned.benOwner;
                if (benOwner&&benOwner!==currentPerson&&relatedPersons.includes(benOwner)&&benOwner.location) {
                    locationGeoRelationFlag = true;
                }
            }
        }
        for (const benOwned of currentPerson.benOwnedJurPersons) {
            if (locationGeoRelationFlag) break;
            if (benOwned.location) {
                const owner = benOwned.owner;
                if (owner&&owner!==currentPerson&&relatedPersons.includes(owner)&&owner.location) {
                    locationGeoRelationFlag = true;
                }
            }
        }
        return locationGeoRelationFlag;
    }

    filterForGeoRelatedPersons(relatedPersonsSet: Set<LocationPresent<Person>>, ignoreList: Set<LocationPresent<Person>>): Set<LocationPresent<Person>> {
        const relatedPersons: LocationPresent<Person>[] = [...relatedPersonsSet];

        let changed: boolean = false;

        do {
            changed = false;

            for (let counter = 0; counter<relatedPersons.length; counter++) {
                const related = relatedPersons[counter];

                if (ignoreList.has(related)) continue;

                const relatedRelationships = related.relationships;
                let locationCounter: number = 0;

                for (let innerCounter=0;innerCounter<relatedRelationships.length; innerCounter++) {
                    if (locationCounter>1) break;
                    const innerRelatedPerson = relatedRelationships[innerCounter].to;
                    if (hasLocation(innerRelatedPerson)) {
                        if (relatedPersons.includes(innerRelatedPerson)) locationCounter++;
                    }
                }

                if (locationCounter<2) {
                    const isLinkedByJurPerson = this.isLinkedByJurPerson(related, relatedPersons);
                    if (isLinkedByJurPerson) locationCounter++;
                }

                if (locationCounter<2) {
                    relatedPersons.splice(counter,1);
                    changed = true;
                }
            }
        }
        while (changed);

        return new Set(relatedPersons);
    }

    extractGeoRelatedPersons(person: Person): Set<LocationPresent<Person>> {
        if (hasLocation(person)) {
            const relatedPersons: Set<LocationPresent<Person>> = new Set([...this.extractRelatedPersons(person)].filter(hasLocation));
            return this.filterForGeoRelatedPersons(relatedPersons, new Set(person.relationships.map(r=>r.to).filter(hasLocation)));
        } else return new Set;
    }

    private extractJurPersonRootPersons (jurPerson: JurPerson): Person[] {
        return [jurPerson.benOwner, jurPerson.owner].filter(hasValue);
    }

    private extractJurPersons (person: Person) {
        return person.ownedJurPersons.concat(person.benOwnedJurPersons);
    }

    public extractRelatedPersons (person: Person): Set<Person> {
        const resultSet: Set<Person> = new Set;

        const initialPersons: Set<Person> = new Set([...person.relationships.map(r=>r.to)]);
        [...initialPersons]
            .map(p=>this.extractJurPersons(p))
            .flat()
            .map(j=>this.extractJurPersonRootPersons(j))
            .flat()
            .forEach(p=>initialPersons.add(p));

        const stack: Person[] = [...initialPersons];

        while (stack.length>0) {
            const currentPerson: Person = stack.shift()!;
            if (resultSet.has(currentPerson)||currentPerson===person) continue;
            resultSet.add(currentPerson)
            currentPerson.relationships.forEach(r=>stack.push(r.to))
        }

        return resultSet;
    }
}