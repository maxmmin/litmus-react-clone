import EntityService from "../EntityService";
import {JurPerson} from "../../../model/jurPerson/JurPerson";

interface JurPersonService extends EntityService<JurPerson> {
    findByName (name: string): Promise<JurPerson[]>
}

export default JurPersonService;