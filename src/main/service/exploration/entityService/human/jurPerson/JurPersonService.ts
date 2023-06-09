import {JurPerson} from "../../../../../model/jurPerson/JurPerson";
import EntityService from "../../EntityService";


interface JurPersonService extends EntityService<JurPerson> {
    findByName (name: string): Promise<JurPerson[]>
}

export default JurPersonService;