import "../assets/styles/linkManager.scss";
import {useState} from "react";

type LinkSaverProps = {
    saveLink(link: string): any
}

export default function LinkSaver ({saveLink}:LinkSaverProps) {
    const [link, setLink] = useState<string>("");
    return (
        <div className={"link-saver-wrapper"}>
            <input type="text" value={link}
                   onInput={e=>setLink(e.currentTarget.value)} className={"link-saver-input form-control"}
                   autoComplete={"new-password"} />
            <button onClick={e=>{
                e.preventDefault();
                saveLink(link);
                setLink("");
            }} className="btn btn-primary link-saver-btn">Додати</button>
        </div>
    )
}