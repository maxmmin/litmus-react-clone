import {geoApiKey} from "../../data/appConfig";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Location} from "../../types/Location";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import {Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover} from "@reach/combobox";
import usePlacesAutocomplete, {
    getGeocode,
} from "use-places-autocomplete";
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";

type Geo = {
    lat: number,
    lng: number
}

const geocode = async (geoData: Geo|string) => {
    const requestArgs:  google.maps.GeocoderRequest = {}

    if (typeof geoData==="string") {
        requestArgs.address = geoData;
    }   else {
        requestArgs.location = {
            lat: geoData.lat,
            lng: geoData.lng
        }
    }

    return await getGeocode({
        language: "ua",
        ...requestArgs
    })
}

const defaultMapPosition: Geo = {
    lat: 50.45466,
    lng: 30.5238
}

const libraries: Libraries = ["places"];

const SelectGeoComponent = () => {
    const { isLoaded } = useLoadScript({
    googleMapsApiKey: geoApiKey,
    libraries: libraries,
});

if (!isLoaded) return <div>Loading...</div>;
return <Map />;
}

const Map = () => {
    const [location, setLocation] = useState<Location|null>(null)

    const handlePlaceCompleteSelect = async (place: google.maps.places.PlaceResult) => {
        console.log(place)
        console.log("i work")
        const geocoder = new google.maps.Geocoder();
        // i should do request with this coords because there's a bug in google maps api. Can't select normal language
        const geocoderResponse = await geocoder.geocode({
            location: {
                lng: place.geometry?.location?.lat()!,
                lat: place.geometry?.location?.lng()!
            },
            region: "UA",
            language: "uk"
        })

        const result = geocoderResponse.results[0]

        if (result) {
            setLocation({label: result.formatted_address, lat: result.geometry.location.lat(), lng: result.geometry.location.lat()})
        }
    }

    const handleMapClick = async ({lat,lng}: Geo) => {
        const geocoder = new google.maps.Geocoder();

        const geocoderResponse = await geocoder.geocode({
            location: {
                lng: lng,
                lat: lat
            },
            region: "UA",
            language: "uk"
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

    return (
    <>
        <div className="places-container">
            <PlacesAutocomplete address={location?location.label:""} setLocation={setLocation} />
        </div>

        <GoogleMap
            center={location?{lat: location.lat, lng: location.lng}:defaultMapPosition}
            zoom={10}
            mapContainerStyle={{
                width: "500px",
                height: "500px"
            }}
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

type AutocompleteProps = {
    address: string,
    setLocation: Dispatch<SetStateAction<Location | null>>;
}

const PlacesAutocomplete = ({address,setLocation}: AutocompleteProps) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        const results = await geocode(address)
        const result = results[0]

        setLocation({ lat: result.geometry.location.lat()!, lng: result.geometry.location.lng()!, label: result.formatted_address});
    };

    useEffect(()=>{
        setValue(address)
    }, [address])

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className="combobox-input"
                placeholder="Search an address"
            />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" &&
                        data.map(({ place_id, description }: {place_id: string, description: string}) => (
                            <ComboboxOption key={place_id} value={description} />
                        ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}


export default SelectGeoComponent;