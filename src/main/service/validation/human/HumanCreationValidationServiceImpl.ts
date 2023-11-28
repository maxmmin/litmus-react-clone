import HumanCreationValidationService from "./HumanCreationValidationService";
import Human, {FullNameCreationParams, HumanCreationParams} from "../../../model/human/Human";
import {ValidationErrors} from "../../../model/ValidationErrors";


abstract class HumanCreationValidationServiceImpl<E extends Human, R=ValidationErrors<E>, S=R> implements HumanCreationValidationService<E,R,S> {
    private static readonly FIRST_NAME_REGEXP = new RegExp("^(?=.{3,32}$)[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*(-[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*)?$");

    private static readonly MIDDLE_NAME_REGEXP = new RegExp("^[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']{3,32}$");

    private static readonly LAST_NAME_REGEXP = new RegExp("^(?=.{3,32}$)[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*(-[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*)?$");

    abstract mapServerValidationErrors(model: E, response: S): R;

    abstract validate(model: E): R;

    abstract hasErrors(bindingResult: R): boolean;

    validateFullName(fullName: FullNameCreationParams): ValidationErrors<FullNameCreationParams> {
        return  {
            firstName: this.isFirstNameValid(fullName.firstName),
            middleName: this.isMiddleNameValid(fullName.middleName),
            lastName: this.isLastNameValid(fullName.lastName)
        };
    }

    isFirstNameValid(firstName: HumanCreationParams["firstName"]): string|null {
        if (firstName) {
            if (firstName.length<3||firstName?.length>32) {
                return "Довжина імені повина бути між 3 та 32 символами"
            }

            if (!HumanCreationValidationServiceImpl.FIRST_NAME_REGEXP.test(firstName)) {
                return "Некоректний формат імені"
            }

            return null;
        } else return "Поле обов'язкове до заповнення"
    }

    isMiddleNameValid(middleName: HumanCreationParams["middleName"]): string|null {
        if (middleName) {
            if (middleName.length<3||middleName.length>32) {
                return "Довжина імені повина бути між 3 та 32 символами"
            }

            if (!HumanCreationValidationServiceImpl.MIDDLE_NAME_REGEXP.test(middleName)) {
                return "Некоректний формат ім'я по-батькові"
            }
        }

        return null;
    }

    isLastNameValid(lastName: HumanCreationParams["lastName"]): string|null {
        if (lastName) {
            if (lastName?.length<3||lastName?.length>32) {
                return "Довжина прізвища повина бути між 3 та 32"
            }

            if (!HumanCreationValidationServiceImpl.LAST_NAME_REGEXP.test(lastName)) {
                return "Некоректний формат прізвища"
            }

            return null;
        } else return "Поле обов'язкове до заповнення"
    }
}

export default HumanCreationValidationServiceImpl;