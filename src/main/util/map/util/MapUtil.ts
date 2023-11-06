import {LocationPresent, RelationsLabelsMetaData} from "../MapPainter";
import Person from "../../../model/human/person/Person";

export default interface MapUtil {
    buildMetadata(personsToDisplay: Set<LocationPresent<Person>>): RelationsLabelsMetaData;
}