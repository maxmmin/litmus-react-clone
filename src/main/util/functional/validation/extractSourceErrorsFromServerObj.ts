import SourceContainableEntity from "../../../model/SourceContainableEntity";
import SourceValidationObject from "../../../service/validation/validationModels/SourceValidationObject";
import getArrayValidationKeyIndex from "./getArrayValidationKeyIndex";

export default function extractSourceErrorsFromServerObj(model: SourceContainableEntity, obj: Record<string, string>) {
    const sourceKeys = Object.keys(obj).filter(k => k.startsWith("sources"))

    const vObjects: SourceValidationObject[] = []

    sourceKeys.forEach(sourceErrKey => {
        const index = getArrayValidationKeyIndex(sourceErrKey);
        if (index !== null) {
            const source = model.sources[index];
            if (source === undefined) throw new Error("validated source not found");
            vObjects.push({source, error: obj[sourceErrKey]})
        }
    })

    return vObjects;
}