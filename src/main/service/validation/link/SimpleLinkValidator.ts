import LinkValidator from "./LinkValidator";

export default class SimpleLinkValidator implements LinkValidator {
    isValid(link: string): boolean {
        try {
            new URL(link);
            return true;
        } catch (_e) {
            return false;
        }
    }
}