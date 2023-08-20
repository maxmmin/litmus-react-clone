import React, {ReactNode} from "react";

type Props = {
    cssAnchor?: string,
    error?: string|null
}

export default function InputError ({cssAnchor,error}: Props) {
    if (!error) {
        return null;
    }

    return <p className={`error-text error-text_input-tip ${cssAnchor?cssAnchor:""}`}>{error}</p>
}