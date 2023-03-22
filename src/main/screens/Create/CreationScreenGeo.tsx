import SelectGeoComponent from "../components/SelectGeoComponent";
import {Tables} from "../../types/explorationParams";

type Props = {
    table: Tables
}

const CreationScreenGeo = ({table}: Props) => {
    return (
        <div className={"creation-page__select-geo-wrapper"}>
            <SelectGeoComponent/>
        </div>
    )
}

export default CreationScreenGeo;