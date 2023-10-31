import Person from "../../model/human/person/Person";
import RipePersonUtil from "./RipePersonUtil";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {isEmptyValue} from "../pureFunctions";

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

    extractGeoRelatedPersons(person: Person): Set<Person> {
        const relatedPersons = [...this.extractRelatedPersons(person)].filter(p=>p.location);

        let changed: boolean = false;

        do {
            changed = false;

            for (let counter = 0; counter<relatedPersons.length; counter++) {
                const related = relatedPersons[counter];

                if (related.relationships.some(r=>r.to===person)) continue;

                const relatedRelationships = related.relationships;
                let locationCounter: number = 0;

                for (let innerCounter=0;innerCounter<relatedRelationships.length; innerCounter++) {
                    if (locationCounter>1) break;
                    const innerRelatedPerson = relatedRelationships[innerCounter].to;
                    if (relatedPersons.includes(innerRelatedPerson)&&person.location) locationCounter++;
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

        return new Set<Person>(relatedPersons);
    }

    private extractJurPersonRootPersons (jurPerson: JurPerson): Person[] {
        return [jurPerson.benOwner, jurPerson.owner].filter(isEmptyValue);
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