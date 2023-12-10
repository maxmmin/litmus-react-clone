import "../assets/styles/linkManager.scss";

type LinkSaverProps = {

}

export default function LinkSaver ({}:LinkSaverProps) {
    return (
        <div className={"link-saver-wrapper"}>
            <input type="text" className={"link-saver-input form-control"} autoComplete={"new-password"} />
            <button className="btn btn-primary link-saver-btn">Додати</button>
        </div>
    )
}