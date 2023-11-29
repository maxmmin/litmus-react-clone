import PersonResponseDto from "./PersonResponseDto";
import {FullName} from "../../../model/human/Human";

export type PersonSimpleResponseDto = Pick<PersonResponseDto, "id"|keyof FullName|"passportData"|"media"|"sex"|"location"|"dateOfBirth">