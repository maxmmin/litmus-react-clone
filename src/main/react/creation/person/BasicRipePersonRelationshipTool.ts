import Person from "../../../model/human/person/Person";

export default class BasicRipePersonRelationshipTool {
    extractRelatedPersons (person: Person, subBranchScanned: Set<Person> = new Set): Set<Person> {
        return person.relationships.reduce((accum, relationship)=>{
            const iteratedPerson = relationship.to;

            let iterationSet: Set<Person> = new Set();

            if (!accum.has(iteratedPerson)&&!subBranchScanned.has(iteratedPerson)) {
                subBranchScanned.add(iteratedPerson);
                iterationSet = this.extractRelatedPersons(iteratedPerson,subBranchScanned);
            }

            iterationSet.add(person);

            return new Set([...accum, ...iterationSet]);
        }, new Set<Person>())
    }
}