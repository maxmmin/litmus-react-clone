import "../assets/styles/linkManager.scss";
import {useContext, useEffect, useState} from "react";
import {LitmusServiceContext} from "../App";


type LinkSaverProps = {
    saveLink(link: string): any,
    validationEnabled?: boolean
}

export default function LinkSaver ({saveLink, validationEnabled = true}:LinkSaverProps) {
    const [link, setLink] = useState<string>("");

    const linkValidator = useContext(LitmusServiceContext).validation.link;

    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        if (validationEnabled) {
            if (link !== "") {
                if (!linkValidator.isValid(link)) {
                    setError("Невалідна адреса джерела");
                } else {
                    if (error) setError(null);
                }
            } else if (error) setError(null);
        }
        // eslint-disable-next-line
    }, [link, validationEnabled])
    return (
        <div className={`link-saver-wrapper ${error?'is-invalid':''}`}>
            <input type="text" value={link}
                   placeholder={"Введіть URL"}
                   onInput={e=>setLink(e.currentTarget.value)}
                   className={`link-saver-input form-control ${error?'is-invalid':''}`}
                   autoComplete={"new-password"} />
            <button disabled={!link||Boolean(error)} onClick={e=>{
                if (link&&!error) {
                    e.preventDefault();
                    saveLink(link);
                    setLink("");
                }
            }} className="btn btn-primary link-saver-btn">Додати</button>
        </div>
    )
}