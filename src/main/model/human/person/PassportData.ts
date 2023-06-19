export default interface PassportData {
    passportSerial: string|null;
    passportNumber: string|null;
    rnokppCode: string|null;
}

export type CreationPassportData = {
    passportSerial: string;
    passportNumber: string;
    rnokppCode: string;
}