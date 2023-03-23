import {geoApiKey} from "../../../data/appConfig";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Location} from "../../../types/Location";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Geo from "../../../types/Geo";
import PlacesAutocomplete from "./PlacesAutocomplete";
import {geocode} from "../../../data/pureFunctions";
import {useAppSelector} from "../../../redux/hooks";


const defaultMapPosition: Geo = {
    lat: 50.45466,
    lng: 30.5238
}


type LocationProps = {
    location: Location|null,
    setLocation: Dispatch<SetStateAction<Location|null>>
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
            <PlacesAutocomplete address={location?location.label:""} setLocation={setLocation} />
        </div>

        <GoogleMap
            center={location?{lat: location.lat, lng: location.lng}:defaultMapPosition}
            zoom={15}
            mapContainerClassName={"geo-modal-map-container"}
            onClick={async (place)=>{
                const results = await geocode({lat: place.latLng?.lat()!, lng: place.latLng?.lng()!})
                const result = results[0];
                setLocation({label: result.formatted_address, lat: result.geometry.location.lat(), lng: result.geometry.location.lng()})
            }}
        >
            <>
                {location && <Marker position={location} />}
            </>
        </GoogleMap>
    </>
    )
}




export default SelectGeoComponent;