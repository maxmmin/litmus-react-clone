import Person from "../../model/human/person/Person";
import RipePersonRelationshipsUtil from "./RipePersonRelationshipsUtil";

export default class BasicRipePersonRelationshipsUtil implements RipePersonRelationshipsUtil{
    public static getInstance () {
        return new BasicRipePersonRelationshipsUtil();
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

                if (related.relationships.findIndex(r=>r.to===person)>-1) continue;

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

    extractRelatedPersons(person: Person): Set<Person> {
        const relatedPersons = this._extractRelatedPersons(person);
        const wasPresent = relatedPersons.delete(person);
        // debug error. if it's being thrown extractor algorithm is wrong. contact the developer, please.
        if (!wasPresent) throw new Error("extractor bug. there should be root entity present in internal extract call.");
        return relatedPersons;
    }

    private _extractRelatedPersons (person: Person, subBranchScanned: Set<Person> = new Set()): Set<Person> {
        return person.relationships.reduce((accum, relationship)=>{
            const iteratedPerson = relationship.to;

            let iterationSet: Set<Person> = new Set();

            if (!accum.has(iteratedPerson)&&!subBranchScanned.has(iteratedPerson)) {
                subBranchScanned.add(iteratedPerson);
                iterationSet = this._extractRelatedPersons(iteratedPerson,subBranchScanned);
            }

            iterationSet.add(iteratedPerson);

            return new Set([...accum, ...iterationSet]);
        }, new Set<Person>())
    }
}