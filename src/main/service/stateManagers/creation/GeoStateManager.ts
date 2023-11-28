import {GeoLocation} from "../../../model/GeoLocation";

export default interface GeoStateManager {
    updateLocation: (location: GeoLocation)=>void
    clearLocation: ()=>void
    getLocation: ()=>GeoLocation|null
}