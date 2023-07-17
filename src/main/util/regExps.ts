const findByFullNameInputsRegExp = /^[А-ЯЁІЇЄҐ][а-яёіїєґ'А-ЯЁІЇЄҐ]+([-][А-ЯЁІЇЄҐ][а-яёіїєґ'А-ЯЁІЇЄҐ]+)*$/u

const allowedSymbolsRegExp =/^[p{L}M0-9_\-.,!?:;()\[\]\\/"'«»А-Яа-яЁёҐґІіЇїЄє`a-zA-Z ]*$/gm

export {findByFullNameInputsRegExp, allowedSymbolsRegExp}