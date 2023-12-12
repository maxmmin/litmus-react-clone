function formatTimeVal(number: number) {
    let strVal: string = number.toString();
    if (strVal.length===1) strVal = `0${strVal}`
    return strVal;
}

export default function formatDate(date: Date): string {
    return `
    ${formatTimeVal(date.getHours())}:${formatTimeVal(date.getMinutes())}:${formatTimeVal(date.getSeconds())}
    ${formatTimeVal(date.getDate())}.${formatTimeVal(date.getMonth()+1)}.${formatTimeVal(date.getFullYear())}`
}