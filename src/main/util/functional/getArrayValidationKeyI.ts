function getArrayValidationKeyI (key: string): number | null {
    const indexMatch = key.match(/\[(\d+)]/);
    if (indexMatch) {
        const index = +indexMatch[1];
        if (isNaN(+index)) throw new Error();
        return index;
    } else return null;
}