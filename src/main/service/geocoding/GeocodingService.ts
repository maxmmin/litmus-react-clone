import GeoCoordinates from "../../model/GeoCoordinates";
import {GeoLocation} from "../../model/GeoLocation";

export default interface GeocodingService {
    reverseGeocode(coordinates: GeoCoordinates): Promise<string>
    reverseGeocodeToGeo(coordinates: GeoCoordinates): Promise<GeoLocation>
    autocomplete(address: string): Promise<string[]>
}