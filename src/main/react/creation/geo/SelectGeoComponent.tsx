import React, {Dispatch, SetStateAction } from "react";
import {GeoLocation} from "../../../model/GeoLocation";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Geo from "../../../model/Geo";
import PlacesAutocomplete from "./PlacesAutocomplete";
import {geocode} from "../../../util/pureFunctions";
import {useAppSelector} from "../../../redux/hooks";


const defaultMapPosition: Geo = {
    lat: 50.45466,
    lng: 30.5238
}


type LocationProps = {
    location: GeoLocation|null,
    setLocation: Dispatch<SetStateAction<GeoLocation|null>>
}

const SelectGeoComponent = ({location, setLocation}: LocationProps) => {
    const isLoaded = useAppSelector(state => state.appState?.gmapsApiState?.isLoaded)
    if (!isLoaded) return <div>Loading...</div>;
    return <Map location={location} setLocation={setLocation} />;
}

const Map = ({location, setLocation}: LocationProps) => {

    return (
    <>
        <div className="places-container">
            <PlacesAutocomplete address={location?location.address:""} setLocation={setLocation} />
        </div>

        <GoogleMap
            center={location?{lat: location.latitude, lng: location.longitude}:defaultMapPosition}
            zoom={15}
            mapContainerClassName={"geo-modal-map-container"}
            onClick={async (place)=>{
                const results = await geocode({lat: place.latLng?.lat()!, lng: place.latLng?.lng()!})
                const result = results[0];
                setLocation({address: result.formatted_address, latitude: result.geometry.location.lat(), longitude: result.geometry.location.lng()})
            }}
        >
            <>
                {location && <Marker position={{lat: location.latitude, lng: location.longitude}} />}
            </>
        </GoogleMap>
    </>
    )
}




export default SelectGeoComponent;