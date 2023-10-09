import {GeoLocation} from "../../GeoLocation";
import DateEntity from "../../DateEntity";
import Sex from "./Sex";
import PassportData from "./PassportData";
import Human from "../Human";
import MediaEntity from "../../MediaEntity";
import {NestedRelationshipResponseDto} from "../../../rest/dto/person/PersonResponseDto";
import CoreEntity from "../../CoreEntity";

export type RelationshipsScanOptions = {
    depth: number
}

export type RelationshipsInfo = {
    scanOptions?: RelationshipsScanOptions,
    relationships: Relationship[]
}

export type NestedPerson = Pick<Person, 'id'> & {
    relationshipsInfo: NestedRelationshipsInfo
}

export type NestedRelationship = Pick<Relationship, 'type'|'note'> &  {
    to: NestedPerson
}

export type NestedRelationshipsInfo = {
    scanOptions: RelationshipsScanOptions,
    relationships: NestedRelationship[]
}

interface Person extends Human, MediaEntity, CoreEntity {
    lastName: string;
    firstName: string;
    relationshipsInfo: RelationshipsInfo,
    sex: Sex | null;
    passportData: PassportData | null;
    dateOfBirth: DateEntity | null;
    location: GeoLocation | null
    nestedRelationshipsInfo?: NestedRelationshipsInfo
}

export const getFullName = (person: Person) => {
    return `${person.lastName} ${person.firstName} ${person.middleName}`
}

export type Relationship = {
    to: Person,
    type: RelationType | null,
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
    private readonly _relationships: Array<Relationship> = new Array<Relationship>();

    constructor(relations?: Array<Relationship>|undefined) {
        if (relations) {
            this._relationships = [...relations]
        }
    }

    /**
     * returns copy of relationShip array. If you want to mutate original array, use addRelation or removeRelation methods.
     */
    get relationships(): Array<Relationship> {
        return [...this._relationships];
    }

    private getOriginalRelationships (): Array<Relationship> {
        return this._relationships;
    }

    checkConstraints(rel: Relationship) {
        if (!rel.to||!rel.to.id||isNaN(+rel.to.id)) {
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

    isPresent (rel: Relationship): boolean {
        const presentRelationships = this.relationships;

        for (let counter = 0; counter<presentRelationships.length; counter++) {
            const checked = presentRelationships[counter];

            if (this.checkIsEqual(rel, checked)) return true;
        }

        return false;
    }

    indexOf (rel: Relationship): number {
        const presentRelationships = this.relationships;

        for (let counter = 0; counter<presentRelationships.length; counter++) {
            const checked = presentRelationships[counter];

            if (this.checkIsEqual(rel, checked)) return counter;
        }

        return -1;
    }

    private checkIsEqual (rel: Relationship, compared: Relationship) {
        return RelationshipsLinkObject.checkIsEqual(rel,compared);
    }

    static checkIsEqual (rel: Relationship, compared: Relationship) {
        return rel.to.id===compared.to.id;
    }
}

export enum RelationType {
    PARENT="PARENT", SPOUSE="SPOUSE", SIBLING="SIBLING", RELATIVE="RELATIVE", FRIEND="FRIEND"
}

export const getRelationTypeFrom = (s: String) => {
   const enumValues = Object.values(RelationType);

   const relationType: RelationType = s as RelationType;

   if (enumValues.includes(relationType)) {
       return relationType;
   } else {
       throw new Error(`RelationType ${s} does not exist`)
   }
}


export default Person;