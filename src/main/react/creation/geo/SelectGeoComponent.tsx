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
import {transform} from "ol/proj";


const defaultMapPosition: GeoCoordinates = {
    lat: 50.45466,
    lng: 30.5238
}

type LocationProps = {
    location: GeoLocation|null,
    setLocation: Dispatch<SetStateAction<GeoLocation|null>>
}

const projections = {
    source: 'EPSG:4326',
    target: 'EPSG:3857'
}

function transformToTarget(coordinates: GeoCoordinates): GeoCoordinates {
    const sourceCoordinates = [coordinates.lng,coordinates.lat]

    const targetCoordinates = transform(sourceCoordinates, projections.source, projections.target);

    return {
        lng: targetCoordinates[0],
        lat: targetCoordinates[1]
    }
}

function transformToSource(coordinates: GeoCoordinates): GeoCoordinates {
    const targetCoordinates = [coordinates.lng,coordinates.lat]

    const sourceCoordinates = transform(targetCoordinates, projections.target, projections.source);

    return {
        lng: sourceCoordinates[0],
        lat: sourceCoordinates[1]
    }
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
        const sourceCoordinates = coordinates||defaultMapPosition;

        const targetCoordinates = transformToTarget(sourceCoordinates);

        const center = [targetCoordinates.lng, targetCoordinates.lat];


        if (mapTargetElement.current) {
            const olMap = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    center: center,
                    zoom: 17
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
                const coordinates = {
                    lng: event.coordinate[0],
                    lat: event.coordinate[1]
                };

                const sourceCoordinates = transformToSource(coordinates);

                setLocation(sourceCoordinates);
                console.log(sourceCoordinates)
            })

            olMap.addOverlay(locationPopup);

            setMap(olMap);

            console.log("map has been initialized")

        }
    }, [mapTargetElement])

    useEffect(()=>{
        if (map&&coordinates) {
            const targetCoordinates = transformToTarget(coordinates);

            locationPopup.show([targetCoordinates.lng, targetCoordinates.lat], '<div><h2>Hello world</h2></div>');
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