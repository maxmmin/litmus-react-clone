type UserSourcesProps = {
    sources: string[]
}

export default function UsedSources ({sources}: UserSourcesProps) {
    return (
        <div className={"used-sources-container"}>
            {sources.map((source, i) =>
                <div className="used-source-container" key={i}>
                    <div className="used-source-container-inner no-scrollbar">
                        <a href={source} className="used-source">{source}</a>
                    </div>
                </div>)}
        </div>
    )
}