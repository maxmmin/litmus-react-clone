import {RelationshipCreationParams} from "../../service/creation/PersonCreationService";
import {Relationship, RelationType} from "../../model/human/person/Person";

class RelationshipAlreadyExists extends Error {

    private readonly _presentRelation: RelationshipCreationParams;


    get presentRelation(): RelationshipCreationParams {
        return this._presentRelation;
    }

    constructor(rel: RelationshipCreationParams) {
        super("Relationship already present in list");
        this._presentRelation = rel;
    }
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


export default class RelationshipsLinkObject {
    private readonly _relationships: Array<RelationshipCreationParams> = new Array<RelationshipCreationParams>();

    constructor(relations?: Array<RelationshipCreationParams>|undefined) {
        if (relations) {
            this._relationships = [...relations]
        }
    }

    /**
     * returns copy of relationShip array. If you want to mutate original array, use addRelation or removeRelation methods.
     */
    get relationships(): Array<RelationshipCreationParams> {
        return [...this._relationships];
    }

    private getOriginalRelationships (): Array<RelationshipCreationParams> {
        return this._relationships;
    }

    checkConstraints(rel: RelationshipCreationParams) {
        if (!rel.to||!rel.to.id||isNaN(+rel.to.id)) {
            throw new Error("attempt to add relationship with non-valid person")
        }
    }

    addRelationship(rel: RelationshipCreationParams): boolean {
        this.checkConstraints(rel);

        const present = this.isPresent(rel);

        if (present) throw new RelationshipAlreadyExists(rel);

        this.getOriginalRelationships().push(rel);

        return true;
    }

    updateRelationship(rel: RelationshipCreationParams): boolean {
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

    removeRelationship(rel: RelationshipCreationParams): boolean {
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

    isPresent (rel: RelationshipCreationParams): boolean {
        const presentRelationships = this.relationships;

        for (let counter = 0; counter<presentRelationships.length; counter++) {
            const checked = presentRelationships[counter];

            if (this.checkIsEqual(rel, checked)) return true;
        }

        return false;
    }

    indexOf (rel: RelationshipCreationParams): number {
        const presentRelationships = this.relationships;

        for (let counter = 0; counter<presentRelationships.length; counter++) {
            const checked = presentRelationships[counter];

            if (this.checkIsEqual(rel, checked)) return counter;
        }

        return -1;
    }

    private checkIsEqual (rel: RelationshipCreationParams, compared: RelationshipCreationParams) {
        return RelationshipsLinkObject.checkIsEqual(rel,compared);
    }

    static checkIsEqual (rel: RelationshipCreationParams, compared: RelationshipCreationParams) {
        return rel.to.id===compared.to.id;
    }
}