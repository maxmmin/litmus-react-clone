import GeocodingService from "./GeocodingService";
import GeoCoordinates from "../../model/GeoCoordinates";
import axios from "axios";
import {GeoLocation} from "../../model/GeoLocation";

type BingReverseGeocodeResponse = {
    resourceSets: Array<{
        resources: Array<{
            name: string;
            address: {
                formattedAddress: string;
                locality: string;
                adminDistrict: string;
                postalCode: string;
                countryRegion: string;
            },
            point: {
                coordinates: number[]
            };
        }>;
    }>;
}

type BingGeocodingResponse = {
    resourceSets: {
        resources: {
            __type: string;
            bbox: [number, number, number, number];
            name: string;
            point: {
                type: string;
                coordinates: [number, number];
            };
            address: {
                addressLine: string;
                adminDistrict: string;
                adminDistrict2: string;
                countryRegion: string;
                formattedAddress: string;
                locality: string;
                postalCode: string;
            };
        }[];
    }[];
    statusCode: number;
    statusDescription: string;
    traceId: string;
}



type BingAutocompleteResponse = {
    resourceSets: Array<{
        resources: Array<{
            value: Array<{
                name: string,
                address: {
                    formattedAddress: string;
                    locality: string;
                    adminDistrict: string;
                    postalCode: string;
                    countryRegion: string;
                };
            }>
        }>;
    }>;
}


export default class BingGeocodingService implements GeocodingService {
    private readonly axiosInstance = axios.create();
    private readonly region = "uk-UA";
    private readonly lang = "uk-UA";

    constructor(private readonly bingKey: string) {
    }

    private formApiReverseGeocodingUrl = (coordinates: GeoCoordinates): string => {
        return `https://dev.virtualearth.net/REST/v1/Locations/${coordinates.lat},${coordinates.lng}?&key=${this.bingKey}&c=${this.lang}`;
    }

    private formApiGeocodingUrl = (address: string): string => {
        return `https://dev.virtualearth.net/REST/v1/Locations?q=${address}userRegion=${this.region}&maxResults=1&c=${this.lang}&key=${this.bingKey}`
    }

    private formApiAutocompleteUrl = (address: string) => {
        return `https://dev.virtualearth.net/REST/v1/Autosuggest?query=${address}&c=${this.lang}&maxResults=10&userRegion=${this.region}&key=${this.bingKey}`
    }

    async reverseGeocode(coordinates: GeoCoordinates): Promise<string> {
        return (await this.reverseGeocodeToGeo(coordinates)).address;
    }

    async geocode(address: string): Promise<GeoLocation> {
        const fetchUrl = this.formApiGeocodingUrl(address);
        const response = await this.axiosInstance.get<BingGeocodingResponse>(fetchUrl);
        console.log(response.data)
        return response.data
            .resourceSets
            .map(resourceSet => {
                return resourceSet.resources;
            })
            .flat()
            .map(resource => {
                console.log(resource)
                const location: GeoLocation = {
                    longitude: resource.point.coordinates[1],
                    latitude: resource.point.coordinates[0],
                    address: resource.address.formattedAddress
                }
                return location;
            })[0]
    }


    async reverseGeocodeToGeo(coordinates: GeoCoordinates): Promise<GeoLocation> {
        const fetchUrl = this.formApiReverseGeocodingUrl(coordinates);
        const response = await this.axiosInstance.get<BingReverseGeocodeResponse>(fetchUrl);
        const locations: GeoLocation[] = response.data.resourceSets
            .flat()
            .map(data=>data.resources)
            .flat()
            .map(place =>({
            address: place.address.formattedAddress,
            latitude: place.point.coordinates[0],
            longitude: place.point.coordinates[1]
        }));
        return locations[0];
    }


    async autocomplete(address: string): Promise<string[]> {
        const fetchUrl = this.formApiAutocompleteUrl(address);
        const response = await this.axiosInstance.get<BingAutocompleteResponse>(fetchUrl);
        const resourceSets = response.data.resourceSets;

        return resourceSets
            .flat()
            .map(resourceSets=>resourceSets.resources)
            .flat()
            .map(res=>res.value)
            .flat()
            .map(place=>place.address.formattedAddress);
    }



}