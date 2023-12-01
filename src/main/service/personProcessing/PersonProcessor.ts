import Person, {NoRelationsPerson, PreProcessedPerson} from "../../model/human/person/Person";


/**
 * Service for restoring original data structure of person
 */export default interface PersonProcessor {
    /**
     *
     * @param person person to process
     * @param limitDepth depth of relations scan
     * should provide the ability of instantiating person entity with shared relations available above limit depth
     * shared relations - relations from different branches(1 root relation - 1 branch), that has reference to entity from another branch
     * root -> shared-person intermediate relations are also consider as shared
     */
    bindAll(person: PreProcessedPerson, limitDepth: number): Promise<Person>;

    /**
     *
     * @param person person to process
     * @param limitDepth depth of relations scan
     * should provide the ability of instantiating person entity with all relations available above limit depth
     */
    bindShared(person: PreProcessedPerson, limitDepth: number): Promise<Person>;

    /**
     * local persons storage
     * is used for storing raw versions of operated persons, which will be used at person's binding
     */
    getPersonsStorage(): Map<number, NoRelationsPerson>;

    /**
     * method used to clear local persons storage
     */
    clearPersonsStorage(): void;

    /** need to be called to remove circular dependencies and give possibility for junk cleaner to clear memory
     *
     * @param person person to be destroyed
     */
    destroy(person: Person): void;
}