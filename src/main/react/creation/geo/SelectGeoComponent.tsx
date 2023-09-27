import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {GeoLocation} from "../../../model/GeoLocation";
import GeoCoordinates from "../../../model/GeoCoordinates";
import PlacesAutocomplete from "./PlacesAutocomplete";
import {useAppSelector} from "../../../redux/hooks";
import 'ol/ol.css';
import 'ol-popup/src/ol-popup.css';
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {View} from "ol";
import Map from 'ol/Map';
import {FullScreen, Zoom} from "ol/control";
import "../../../css/map.scss";
import Popup from "ol-popup";
import {LitmusServiceContext} from "../../App";


const defaultMapPosition: GeoCoordinates = {
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
    return <GeoComponent location={location} setLocation={setLocation} />;
}

type MapLocationProps = {
    coordinates: GeoCoordinates|null,
    setLocation: (coordinates: GeoCoordinates)=>void
}

const MapComponent = ({coordinates, setLocation}: MapLocationProps) => {
    const mapTargetElement = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<Map | undefined>();
    const [locationPopup, setLocationPopup] = useState(new Popup());

    useEffect(()=>{
        const mapCoordinates = coordinates||defaultMapPosition;
        const center = [mapCoordinates.lng,mapCoordinates.lat]

        if (mapTargetElement.current) {
            const olMap = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                pixelRatio: 1,
                view: new View({
                    center: center,
                    zoom: 15,
                    projection: 'EPSG:4326',
                }),
                controls: [
                    new FullScreen({
                        className: 'map-fullscreen-btn',
                        label: '\u26F6',
                        labelActive: '\u2716'
                    }),
                    new Zoom({
                        className: 'map-zoom'
                    })
                ]
            });

            olMap.setTarget(mapTargetElement.current);
            olMap.on("click", (event) => {
                setLocation({
                    lng: event.coordinate[0],
                    lat: event.coordinate[1]
                });
            })

            olMap.addOverlay(locationPopup);

            setMap(olMap);

            console.log("map has been initialized")

        }
    }, [mapTargetElement])

    useEffect(()=>{
        if (coordinates) {
            locationPopup.show([coordinates.lng, coordinates.lat], "position");
        }
    }, [coordinates])

    useEffect(()=>{
        if (map&&coordinates) {
            locationPopup.show([coordinates.lng, coordinates.lat], '<div><h2>Hello world</h2></div>');
        }
    }, [coordinates, map])

    return (
        <div className="map" ref={mapTargetElement}>
        </div>
    )
}

const GeoComponent = ({location, setLocation}: LocationProps) => {
    const geocodingService = useContext(LitmusServiceContext).geocodingService;
    console.log(location)
    return (
    <>
        <div className="places-container">
            <PlacesAutocomplete address={location?location.address:""} setLocation={setLocation} />
        </div>

        <div className="modal__map-wrapper">
            <MapComponent coordinates={location?{lat: location.latitude, lng: location.longitude}:null} setLocation={async (coordinates)=>{
                const location = await geocodingService.reverseGeocodeToGeo(coordinates);
                setLocation(location);
            }}/>
        </div>
    </>
    )
}




export default SelectGeoComponent;

// <GoogleMap
//     center={location?{lat: location.latitude, lng: location.longitude}:defaultMapPosition}
//     zoom={15}
//     mapContainerClassName={"geo-modal-map-container"}
//     onClick={async (place)=>{
//         const results = await geocode({lat: place.latLng?.lat()!, lng: place.latLng?.lng()!})
//         const result = results[0];
//         setLocation({address: result.formatted_address, latitude: result.geometry.location.lat(), longitude: result.geometry.location.lng()})
//     }}
// >
//     <>
//         {location && <Marker position={{lat: location.latitude, lng: location.longitude}} />}
//     </>
// </GoogleMap>