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


type BingGeocodeResponse = {
    resourceSets: Array<{
        resources: Array<{
            name: string;
            point: {
                type: string;
                coordinates: [number, number];
            };
            address: {
                formattedAddress: string;
                locality: string;
                adminDistrict: string;
                postalCode: string;
                countryRegion: string;
            };
        }>;
    }>;
}


export default class BingGeocodingService implements GeocodingService {
    private readonly axiosInstance = axios.create();
    private readonly region = "uk-UA";
    private readonly lang = "uk-UA";

    constructor(private readonly bingKey: string) {
    }

    private formApiReverseUrl = (coordinates: GeoCoordinates): string => {
        return `http://dev.virtualearth.net/REST/v1/Locations/${coordinates.lat},${coordinates.lng}?&key=${this.bingKey}&c=${this.lang}`;
    }

    private formApiAutocompleteUrl = (address: string) => {
        return `http://dev.virtualearth.net/REST/v1/Autosuggest?query=${address}&c=${this.lang}&maxResults=20&userRegion=${this.region}&key=${this.bingKey}`
    }

    async reverseGeocode(coordinates: GeoCoordinates): Promise<string> {
        return (await this.reverseGeocodeToGeo(coordinates)).address;
    }

    async reverseGeocodeToGeo(coordinates: GeoCoordinates): Promise<GeoLocation> {
        const fetchUrl = this.formApiReverseUrl(coordinates);
        const response = await this.axiosInstance.get<BingReverseGeocodeResponse>(fetchUrl);
        console.log(response.data.resourceSets)
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
        const response = await this.axiosInstance.get<BingGeocodeResponse>(fetchUrl);
        const resourceSets = response.data.resourceSets;

        return resourceSets
            .flat()
            .map(resourceSets=>resourceSets.resources)
            .flat()
            .map(place=>place.address.formattedAddress);
    }



}