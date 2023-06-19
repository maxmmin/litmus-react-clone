export function isEmpty(obj: unknown): boolean {
    let isObjEmpty: boolean;

    if (obj !== undefined && obj !== null) {
        if (typeof obj === "string") {
            isObjEmpty = obj.trim().length < 1;
        } else {
            let isAllFieldsEmpty: boolean = true;

            const values: any[] = Object.values(obj);

            for (let cursor = 0; cursor < values.length; cursor++) {
                const value = values[cursor];
                if (!isEmpty(value)) {
                    isAllFieldsEmpty = false;
                    break;
                }
            }

            isObjEmpty = isAllFieldsEmpty;
        }
    } else isObjEmpty = true;

    return isObjEmpty;
}

export default isEmpty;