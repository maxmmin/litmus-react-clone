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
                address: Partial<{
                    formattedAddress: string;
                    locality: string;
                    adminDistrict: string;
                    postalCode: string;
                    countryRegion: string;
                }>;
            }>
        }>;
    }>;
}

function calculateLevenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
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
        return `https://dev.virtualearth.net/REST/v1/Locations?q=${address}userRegion=${this.region}&maxResults=10&c=${this.lang}&key=${this.bingKey}`
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

        const locations = response.data
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
            });

        let bestLocation: GeoLocation|null = null;

        let minimalDeviation: number = Number.MAX_VALUE;

        for (const location of locations) {
            const deviation = calculateLevenshteinDistance(address, location.address);
            if (deviation < minimalDeviation) {
                minimalDeviation = deviation;
                bestLocation = location;
            }
        }

        if (!bestLocation) throw new Error("no location found");

        return bestLocation;
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
            .map(place=>{
                return place.address.formattedAddress;
            })
            .filter((a): a is string=>typeof a === 'string');
    }



}