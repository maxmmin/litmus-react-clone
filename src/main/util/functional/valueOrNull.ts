import {noInfoMessage} from "../../error/BasicHttpError";

export const valueOrMessage = <T> (value: T|undefined) => value?value:noInfoMessage
const valueOrNull = <T> (value: T|undefined): T|null => value?value:null

export default valueOrNull