import {Location} from "./Location";
import {PassportData} from "./PassportData";
import DateEntity from "./DateEntity";
import Sex from "./Sex";
import person from "./Person";

type Person = {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    relationshipsLinkObject: RelationshipsLinkObject,
    sex: Sex | null;
    passportData: PassportData | null;
    dateOfBirth: DateEntity;
    location: Location | null
}

export const getFullName = (person: Person) => {
    return `${person.lastName} ${person.firstName} ${person.middleName}`
}

export type Relationship ={
    person: Person,
    relationType: RelationType | null,
    note: string
}

class RelationshipAlreadyExists extends Error {

    private readonly _presentRelation: Relationship;


    get presentRelation(): Relationship {
        return this._presentRelation;
    }

    constructor(rel: Relationship) {
        super("Relationship already present in list");
        this._presentRelation = rel;
    }
}

export class RelationshipsLinkObject {
    private _relationships: Array<Relationship> = new Array<Relationship>();

    /**
     * returns copy of relationShip array. If you want to mutate original array, use addRelation or removeRelation methods.
     */
    get relationships(): Array<Relationship> {
        return [...this._relationships];
    }

    private set relationships(relationList) {
        this._relationships = [...relationList];
    }

    loadRelationsFromLinkObject (relationshipsLinkObj: RelationshipsLinkObject) {
        this.relationships = [...relationshipsLinkObj.relationships];
    }

    private getOriginalRelationships (): Array<Relationship> {
        return this._relationships;
    }

    checkConstraints(rel: Relationship) {
        if (!rel.person||!rel.person.id||isNaN(+rel.person.id)) {
            throw new Error("attempt to add relationship with non-valid person")
        }
    }

    addRelationship(rel: Relationship): boolean {
        this.checkConstraints(rel);

        const present = this.isPresent(rel);

        if (present) throw new RelationshipAlreadyExists(rel);

        this.getOriginalRelationships().push(rel);

        return true;
    }

    updateRelationship(rel: Relationship): boolean {
        this.checkConstraints(rel);

        const relationships = this.getOriginalRelationships();

        for (let counter = 0; counter<relationships.length; counter++) {
            const current = relationships[counter];

            if (this.checkIsEqual(rel, current)) {
                relationships.splice(counter, 1, rel);
                return true;
            }
        }

        return false;
    }

    removeRelationship(rel: Relationship): boolean {
        const relationships = this.getOriginalRelationships();

        for (let counter = 0; counter<relationships.length; counter++) {
            const current = relationships[counter];

            if (this.checkIsEqual(rel, current)) {
                relationships.splice(counter, 1);
                return true;
            }
        }

        return false;
    }

    private isPresent (rel: Relationship): boolean {
        const presentRelationships = this.relationships;

        for (let counter = 0; counter<presentRelationships.length; counter++) {
            const checked = presentRelationships[counter];

            if (this.checkIsEqual(rel, checked)) return true;
        }

        return false;
    }

    private checkIsEqual (rel: Relationship, compared: Relationship) {
        return rel.person.id===compared.person.id;
    }
}

export enum RelationType {
    PARENT="RELATIVE", SPOUSE="SPOUSE", SIBLING="SIBLING", RELATIVE="RELATIVE", FRIEND="FRIEND"
}



export default Person;