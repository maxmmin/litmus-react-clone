import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {GeoLocation} from "../../model/GeoLocation";
import GeoCoordinates from "../../model/GeoCoordinates";
import PlacesAutocomplete from "../creation/geo/PlacesAutocomplete";
import 'ol/ol.css';
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {View} from "ol";
import Map from 'ol/Map';
import {FullScreen, Zoom} from "ol/control";
import "../assets/styles/map.scss";
import {LitmusServiceContext} from "../App";
import Popup from "ol-ext/overlay/Popup";
import "../assets/styles/ol-ext-min.css";
import {defaultMapPosition, transformToSource, transformToTarget} from "../../util/map/mapUtilites";
import '../assets/styles/geo.scss'
import Loader from "../loader/Loader";
import LoaderSpinner from "../loader/LoaderSpinner";

type LocationProps = {
    location: GeoLocation|null,
    setLocation: Dispatch<SetStateAction<GeoLocation|null>>
}



const SelectGeoComponent = ({location, setLocation}: LocationProps) => {
    return <GeoComponent location={location} setLocation={setLocation} />;
}

type MapLocationProps = {
    coordinates: GeoCoordinates|null,
    setLocation: (coordinates: GeoCoordinates)=>any
}

const MapComponent = ({coordinates, setLocation}: MapLocationProps) => {
    const mapTargetElement = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<Map | undefined>();
    const [pending, setPending] = useState<boolean>(false);

    const [locationPopup, _] = useState(new Popup({
        popupClass: "user-select-location-popup",
        closeBox: false,
        positioning: 'bottom-center'
    }));

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

                const data = setLocation(sourceCoordinates);

                if (data instanceof Promise) {
                    setPending(true);
                    data.finally(()=>setPending(false))
                }
            })

            olMap.addOverlay(locationPopup);

            setMap(olMap);

            console.log("map has been initialized")

        }},
[mapTargetElement, locationPopup])

    useEffect(()=>{
        if (map&&coordinates) {
            const targetCoordinates = transformToTarget(coordinates);
            const coordinatesList = [targetCoordinates.lng, targetCoordinates.lat];
            locationPopup.show(coordinatesList,
                `<div class="user-location-icon-wrapper">
                            <svg class="user-location-icon" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/><path d="M0 0h48v48h-48z" fill="none"/></svg>  
                      </div>`);
            map.getView().setCenter(coordinatesList)
        }
    }, [coordinates, map])

    useEffect(() => {
        if (map) {
            map.dispose();
        }
    }, []);

    return (
        <div className="map" ref={mapTargetElement}>
            {pending &&
                <div className={"map-loader-container"}>
                    <LoaderSpinner cssAnchor={"map-loader"}/>
                </div>
            }
        </div>
    )
}

const GeoComponent = ({location, setLocation}: LocationProps) => {
    const geocodingService = useContext(LitmusServiceContext).geocodingService;

    return (
    <>
        <div className="places-container">
            <PlacesAutocomplete address={location?location.address:""} setLocation={setLocation} />
        </div>

        <div className="modal__map-wrapper">
            <MapComponent coordinates={location?{lat: location.latitude, lng: location.longitude}:null} setLocation={async (coordinates)=>{
                const address = await geocodingService.reverseGeocode(coordinates);
                setLocation({
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    address: address
                });
            }}/>
        </div>
    </>
    )
}




export default SelectGeoComponent;