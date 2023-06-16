/**
 * function code is generated by chat gpt
 * in application it used for make new-created objects serializable for correctly work of redux
 * @param obj - any object need to be deep copied
 * function returns full-copied object provided as argument. nested objects are getting cloned too
 */
export default function deepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    let copy: any;
    if (Array.isArray(obj)) {
        copy = [];
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj[i]);
        }
    } else {
        copy = {};
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = deepCopy(obj[key]);
            }
        }
    }

    return copy;
}