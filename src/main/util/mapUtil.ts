import GeoCoordinates from "../model/GeoCoordinates";
import {transform} from "ol/proj";

export const projections = {
    source: 'EPSG:4326',
    target: 'EPSG:3857'
}

export const defaultMapPosition: GeoCoordinates = {
    lat: 50.45466,
    lng: 30.5238
}

export function transformToTarget(coordinates: GeoCoordinates): GeoCoordinates {
    const sourceCoordinates = [coordinates.lng,coordinates.lat]

    const targetCoordinates = transform(sourceCoordinates, projections.source, projections.target);

    return {
        lng: targetCoordinates[0],
        lat: targetCoordinates[1]
    }
}

export function transformToSource(coordinates: GeoCoordinates): GeoCoordinates {
    const targetCoordinates = [coordinates.lng,coordinates.lat]

    const sourceCoordinates = transform(targetCoordinates, projections.target, projections.source);

    return {
        lng: sourceCoordinates[0],
        lat: sourceCoordinates[1]
    }
}