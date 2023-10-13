import Person from "../../model/human/person/Person";
import RipePersonRelationshipsUtil from "./RipePersonRelationshipsUtil";

export default class BasicRipePersonRelationshipsUtil implements RipePersonRelationshipsUtil{
    public static getInstance () {
        return new BasicRipePersonRelationshipsUtil();
    }

    extractGeoRelatedPersons(person: Person): Set<Person> {
        const relatedPersons = [...this.extractRelatedPersons(person)].filter(p=>p.location);

        let changed: boolean = false;

        do {
            changed = false;

            for (let counter = 0; counter<relatedPersons.length; counter++) {
                const related = relatedPersons[counter];
                // check if the related person non root
                if (person.relationships.findIndex(r=>r.to===related)===-1) {
                    const relatedRelationships = related.relationships;
                    let locationCounter: number = 0;

                    for (let innerCounter=0;innerCounter<relatedRelationships.length; innerCounter++) {
                        if (locationCounter>1) break;
                        const innerRelatedPerson = relatedRelationships[innerCounter].to;
                        if (relatedPersons.includes(innerRelatedPerson)&&person.location) locationCounter++;
                    }

                    if (locationCounter<2) {
                        relatedPersons.splice(counter,1);
                        changed = true;
                    }
                }
            }
        }
        while (changed);

        return new Set<Person>(relatedPersons);
    }

    extractRelatedPersons (person: Person, subBranchScanned: Set<Person> = new Set): Set<Person> {
        return person.relationships.reduce((accum, relationship)=>{
            const iteratedPerson = relationship.to;

            let iterationSet: Set<Person> = new Set();

            if (!accum.has(iteratedPerson)&&!subBranchScanned.has(iteratedPerson)) {
                subBranchScanned.add(iteratedPerson);
                iterationSet = this.extractRelatedPersons(iteratedPerson,subBranchScanned);
            }

            iterationSet.add(iteratedPerson);

            return new Set([...accum, ...iterationSet]);
        }, new Set<Person>())
    }
}