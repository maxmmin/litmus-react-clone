/**
 * it used for make new-created objects serializable for correctly work of redux
 * exception is function values
 * @param obj - any object need to be deep copied
 * function returns full-copied object provided as argument. nested objects are getting cloned too
 */
export default function serializableDeepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    let copy: any;
    if (Array.isArray(obj)) {
        copy = [];
        for (let i = 0; i < obj.length; i++) {
            if (typeof obj[i] !== 'function') {
                copy[i] = serializableDeepCopy(obj[i]);
            }
        }
    } else {
        copy = {};
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)&& typeof obj[key] !== 'function') {
                copy[key] = serializableDeepCopy(obj[key]);
            }
        }
    }

    return copy;
}