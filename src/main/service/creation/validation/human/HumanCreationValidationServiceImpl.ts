import HumanCreationValidationService from "./HumanCreationValidationService";
import Human from "../../../../model/human/Human";
import {hasErrors} from "../../../exploration/validation/BasicExplorationValidationService";
import {ValidationErrors} from "../../../ValidationErrors";

abstract class HumanCreationValidationServiceImpl<E extends Human, R=E, S=R> implements HumanCreationValidationService<E,R,S> {
    private static readonly FIRST_NAME_REGEXP = new RegExp("^(?=.{3,32}$)[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*(-[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*)?$");

    private static readonly MIDDLE_NAME_REGEXP = new RegExp("^[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']{3,32}$");

    private static readonly LAST_NAME_REGEXP = new RegExp("^(?=.{3,32}$)[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*(-[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*)?$");

    abstract formValidationErrors(response: ValidationErrors<S>): ValidationErrors<R>;

    validate(model: E): ValidationErrors<R> {
        return {
            firstName: this.isFirstNameValid(model.firstName),
            middleName: this.isMiddleNameValid(model.middleName),
            lastName: this.isLastNameValid(model.lastName)
        } as ValidationErrors<R>;
    }

    validateFullName(model: Human): ValidationErrors<Human>|null {
        const bindingRes = {
            firstName: this.isFirstNameValid(model.firstName),
            middleName: this.isMiddleNameValid(model.middleName),
            lastName: this.isLastNameValid(model.lastName)
        };

        if (hasErrors(bindingRes)) {
            return {
                firstName: this.isFirstNameValid(model.firstName),
                middleName: this.isMiddleNameValid(model.middleName),
                lastName: this.isLastNameValid(model.lastName)
            }
        }
        else return null;
    }


    isFirstNameValid(firstName: Human["firstName"]): string|undefined {
        if (firstName) {
            if (firstName.length<3||firstName?.length>32) {
                return "Довжина імені повина бути між 3 та 32 символами"
            }

            if (!HumanCreationValidationServiceImpl.FIRST_NAME_REGEXP.test(firstName)) {
                return "Некоректний формат імені"
            }
        } else return "Поле обов'язкове до заповнення"
    }

    isMiddleNameValid(middleName: Human["middleName"]): string|undefined {
        if (middleName) {
            if (middleName.length<3||middleName.length>32) {
                return "Довжина імені повина бути між 3 та 32 символами"
            }

            if (!HumanCreationValidationServiceImpl.MIDDLE_NAME_REGEXP.test(middleName)) {
                return "Некоректний формат ім'я по-батькові"
            }
        }
    }

    isLastNameValid(lastName: Human["lastName"]): string|undefined {
        if (lastName) {
            if (lastName?.length<3||lastName?.length>32) {
                return "Довжина прізвища повина бути між 3 та 32"
            }

            if (!HumanCreationValidationServiceImpl.LAST_NAME_REGEXP.test(lastName)) {
                return "Некоректний формат прізвища"
            }
        } else return "Поле обов'язкове до заповнення"
    }
}

export default HumanCreationValidationServiceImpl;