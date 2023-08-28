export default <T> (value: T|undefined): T|null => value?value:null

export const valueOrMessage = <T> (value: T|undefined) => value?value:"інформація відсутня"