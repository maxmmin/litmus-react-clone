import GeoCoordinates from "../../model/GeoCoordinates";
import {GeoLocation} from "../../model/GeoLocation";

export default interface GeocodingService {
    geocode(address: string): Promise<GeoLocation>
    reverseGeocode(coordinates: GeoCoordinates): Promise<string>;
    /**
     *
     * @param coordinates
     * returns result of geocoding with coordinates provided by geocoding service
     */
    reverseGeocodeToGeo(coordinates: GeoCoordinates): Promise<GeoLocation>
    autocomplete(address: string): Promise<string[]>
}