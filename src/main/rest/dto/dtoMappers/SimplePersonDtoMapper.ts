import {SimplePersonResponseDto} from "../person/PersonResponseDto";
import Person from "../../../model/human/person/Person";

export default class SimplePersonDtoMapper {
    mapSimpleResponseDtoToEntity(dto: SimplePersonResponseDto): Person {
        const person: Person = {
            id: dto.id,
            media: {mainImage: dto.media.mainImage,
                images: dto.media.images||[]},
            passportData: null,
            location: null,
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            relationships: [],
            benOwnedJurPersons: [],
            ownedJurPersons: [],
            dateOfBirth: null,
            sex: dto.sex
        }

        return person;
    }

    static getInstance () {
        return new SimplePersonDtoMapper();
    }
}
