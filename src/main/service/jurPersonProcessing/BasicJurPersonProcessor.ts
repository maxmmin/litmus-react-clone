import JurPersonProcessor from "./JurPersonProcessor";
import {JurPerson, PreProcessedJurPerson} from "../../model/jurPerson/JurPerson";
import Person, {PreProcessedPerson} from "../../model/human/person/Person";
import Sex from "../../model/human/person/Sex";
import BasicPersonProcessor from "../personProcessing/BasicPersonProcessor";
import {checkNotEmpty} from "../../util/pureFunctions";
import JurPersonDtoMapper from "../../rest/dto/dtoMappers/JurPersonDtoMapper";
import {EmbedPersonResponseDto, RelatedPersonResponseDto} from "../../rest/dto/person/PersonResponseDto";
import PersonProcessor from "../personProcessing/PersonProcessor";
import JurPersonDtoMapperImpl from "../../rest/dto/dtoMappers/JurPersonDtoMapperImpl";

export default class BasicJurPersonProcessor implements JurPersonProcessor {

    public static getInstance(dtoMapper: JurPersonDtoMapper = JurPersonDtoMapperImpl.getInstance(),
        personProcessor: PersonProcessor = BasicPersonProcessor.getInstance(dtoMapper)): BasicJurPersonProcessor {
            return new BasicJurPersonProcessor(personProcessor, dtoMapper);
    }

    constructor(protected readonly personProcessor: PersonProcessor,
                protected readonly dtoMapper: JurPersonDtoMapper) {
    }

    private createVirtualPerson(): PreProcessedPerson {
        return  {
            id: -1,
            firstName: "",
            middleName: "",
            lastName: "",
            media: {mainImage: null, images: []},
            sex: Sex.UNKNOWN,
            relationshipsInfo: {
                scanOptions: {depth: -1},
                relationships: []
            },
            ownedJurPersons: [],
            benOwnedJurPersons: [],
            dateOfBirth: null,
            location: null,
            passportData: null
        }
    }

    private setupVirtualPerson(preProcessedJurPerson: PreProcessedJurPerson): PreProcessedPerson {
        const virtualRootPerson = this.createVirtualPerson();

        const ownerDto = preProcessedJurPerson.owner;
        const benOwnerDto = preProcessedJurPerson.benOwner;

        if (ownerDto) {
            const jpIndex = checkNotEmpty(ownerDto.ownedJurPersons.findIndex(j=>j.id===preProcessedJurPerson.id));
            ownerDto.ownedJurPersons.splice(jpIndex, 1, preProcessedJurPerson);
            virtualRootPerson.relationshipsInfo.relationships!.push({
                type: null,
                person: ownerDto,
                note: null
            });
        }

        if (benOwnerDto) {
            const jpIndex = checkNotEmpty(benOwnerDto.benOwnedJurPersons.findIndex(j=>j.id===preProcessedJurPerson.id));
            benOwnerDto.benOwnedJurPersons.splice(jpIndex, 1, preProcessedJurPerson);
            virtualRootPerson.relationshipsInfo.relationships!.push({
                type: null,
                person: benOwnerDto,
                note: null
            });
        }

        return virtualRootPerson;
    }

    private processVirtualPersonData (vRipePerson: Person, preProcessedJurPerson: PreProcessedJurPerson): JurPerson {
        let owner: Person|null = null;
        const ownerDto: RelatedPersonResponseDto|null = preProcessedJurPerson.owner;
        if (ownerDto) {
            owner = vRipePerson.relationships.find(p=>p.to.id===ownerDto.id)!.to;
        }

        let benOwner: Person|null = null;
        const benOwnerDto: RelatedPersonResponseDto|null = preProcessedJurPerson.benOwner;
        if (benOwnerDto) {
            benOwner = vRipePerson.relationships.find(p=>p.to.id===benOwnerDto.id)!.to;
        }

        let jurPerson: JurPerson|null = null;
        if (owner) {
            jurPerson = owner.ownedJurPersons.find(r=>r.id===preProcessedJurPerson.id)!;
        } else if (benOwner) {
            jurPerson = benOwner.benOwnedJurPersons.find(r=>r.id===preProcessedJurPerson.id)!;
        } else {
            jurPerson = this.dtoMapper.mapToRipeJurPerson(preProcessedJurPerson, null, null);
        }

        return checkNotEmpty(jurPerson);
    }

    async bindAll(preProcessedJurPerson: PreProcessedJurPerson, limitDepth: number): Promise<JurPerson> {
        const virtualRootPerson = this.setupVirtualPerson(preProcessedJurPerson);
        const person: Person = await this.personProcessor.bindAll(virtualRootPerson, limitDepth);
        return this.processVirtualPersonData(person, preProcessedJurPerson);
    }

    async bindShared(preProcessedJurPerson: PreProcessedJurPerson, limitDepth: number): Promise<JurPerson> {
        const virtualRootPerson = this.setupVirtualPerson(preProcessedJurPerson);
        const person: Person = await this.personProcessor.bindAll(virtualRootPerson, limitDepth);
        return this.processVirtualPersonData(person, preProcessedJurPerson);
    }

    clearStorage(): void {
        this.personProcessor.clearPersonsStorage();
    }

    destroy(jurPerson: JurPerson): void {
        if (jurPerson.owner) this.personProcessor.destroy(jurPerson.owner);
        if (jurPerson.benOwner) this.personProcessor.destroy(jurPerson.benOwner);
    }

}