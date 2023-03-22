import {geoApiKey} from "../../data/appConfig";
import GoogleMapReact, {Coords} from "google-map-react";
import React, {useEffect, useRef, useState} from "react";
import {GeoLocationIcon} from "../../data/icons";
import {Location} from "../../types/Location";
import ReactGoogleAutocomplete from "react-google-autocomplete";


const GeoMarker = ({lat, lng}: {lat: number, lng: number}) => {
    return <GeoLocationIcon className={""} style={{
        position: 'relative',
        left: '-22.5px',
        top: '-50px',
        width: '45px',
        height: '45px'
    }} color={"#6750A4"}/>
}

type Geo = {
    lat: number,
    lng: number
}

const defaultMapPosition: Coords = {
    lat: 50.45466,
    lng: 30.5238
}

const GeoComponent = () => {
    const [inputValue, setInputValue] = useState<string>("")

    const [location, setLocation] = useState<Location|null>(null)

    const handlePlaceCompleteSelect = (place: google.maps.places.PlaceResult) => {
            setLocation({label: place.formatted_address!, lat: place.geometry!.location!.lat(), lng: place.geometry!.location!.lng()})
    }

    const handleMapClick = async ({lat,lng}: Geo) => {
        const geocoder = new google.maps.Geocoder();

        const geocoderResponse = await geocoder.geocode({
            location: {
                lng: lng,
                lat: lat
            },
            language: "ru"
        })

        if (geocoderResponse.results.length > 0) {
            const result = geocoderResponse.results[0]
            return setLocation({
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
                label: result.formatted_address
            })
        }
    }

    useEffect(()=>{
        if (location?.label!==undefined&&(inputValue!==location.label)) {
            setInputValue(location.label)
        }
    }, [location])


    return <GoogleMapReact
        bootstrapURLKeys={{
            key: geoApiKey,
            language: 'ru',
            region: 'UA',
            libraries: ["places"]
        }}
        center={location?{lat: location.lat, lng: location.lng}:defaultMapPosition}
        defaultZoom={10}
        style={{height: '500px', width: '500px'}}
        onClick={handleMapClick}
    >
        <>
            <ReactGoogleAutocomplete
                style={{ width: "100%", height: "40px", paddingLeft: 16, marginTop: 2, marginBottom: "2rem" }}
                value={inputValue}
                apiKey={geoApiKey}
                types={["region"]}
                onPlaceSelected={handlePlaceCompleteSelect}
                onInput={(e: any)=>{
                    const event = e as React.ChangeEvent<HTMLInputElement>
                    setInputValue(event.currentTarget.value)
                }}
            />
        </>
        {location&&<GeoMarker lat={location.lat} lng={location.lng}/>}
    </GoogleMapReact>
}

export default GeoComponent;