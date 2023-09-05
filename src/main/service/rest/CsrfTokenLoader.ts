export type CsrfResponse = {
    "parameterName": string,
    "token": string,
    "headerName": string
}
export default interface CsrfTokenLoader {
    loadCsrfToken(): Promise<CsrfResponse>
}

