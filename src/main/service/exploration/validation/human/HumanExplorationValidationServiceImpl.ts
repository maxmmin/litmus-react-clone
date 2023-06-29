import HumanExplorationValidationService from "./HumanExplorationValidationService";
import HumanExplorationParams from "../../../../redux/types/exploration/human/HumanExplorationParams";
import BasicExplorationValidationService from "../BasicExplorationValidationService";

class HumanExplorationValidationServiceImpl extends BasicExplorationValidationService implements HumanExplorationValidationService {
    private static readonly FIRST_NAME_REGEXP = new RegExp("^(?=.{3,32}$)[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*(-[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*)?$");

    private static readonly MIDDLE_NAME_REGEXP = new RegExp("^[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']{3,32}$");

    private static readonly LAST_NAME_REGEXP = new RegExp("^(?=.{3,32}$)[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*(-[А-ЩЬЮЯҐІЇЄ][а-щьюяґіїє']*)?$");

    validate(params: HumanExplorationParams): Partial<Record<keyof HumanExplorationParams, string>> {
        const baseValidation = super.validate(params);
        return {
            ...baseValidation,
            firstName: this.isFirstNameValid(params.firstName),
            middleName: this.isMiddleNameValid(params.middleName),
            lastName: this.isLastNameValid(params.lastName)
        };
    }

    validateFullName(params: HumanExplorationParams): Partial<Record<keyof HumanExplorationParams, string>>|null {
        const bindingRes = {
            firstName: this.isFirstNameValid(params.firstName),
            middleName: this.isMiddleNameValid(params.middleName),
            lastName: this.isLastNameValid(params.lastName)
        };

        if (this.hasErrors(bindingRes)) {
            return {
                firstName: this.isFirstNameValid(params.firstName),
                middleName: this.isMiddleNameValid(params.middleName),
                lastName: this.isLastNameValid(params.lastName)
            }
        }
        else return null;
    }


    isFirstNameValid(firstName: HumanExplorationParams["firstName"]): string|undefined {
        if (firstName) {
            if (firstName.length<3||firstName?.length>32) {
                return "Довжина імені повина бути між 3 та 32 символами"
            }

            if (!HumanExplorationValidationServiceImpl.FIRST_NAME_REGEXP.test(firstName)) {
                return "Введіть ім'я у коректному форматі"
            }
        }
    }

    isMiddleNameValid(middleName: HumanExplorationParams["middleName"]): string|undefined {
        if (middleName) {
            if (middleName.length<3||middleName.length>32) {
                return "Довжина імені повина бути між 3 та 32 символами"
            }

            if (!HumanExplorationValidationServiceImpl.MIDDLE_NAME_REGEXP.test(middleName)) {
                return "Введіть ім'я по-батькові у коректному форматі"
            }
        }
    }

    isLastNameValid(lastName: HumanExplorationParams["lastName"]): string|undefined {
        if (lastName) {
            if (lastName?.length<3||lastName?.length>32) {
                return "Довжина прізвища повина бути між 3 та 32 символами"
            }

            if (!HumanExplorationValidationServiceImpl.LAST_NAME_REGEXP.test(lastName)) {
                return "Введіть ім'я по-батькові у коректному форматі"
            }
        } else return "Поле обов'язкове до заповнення"
    }
}

export default HumanExplorationValidationServiceImpl;