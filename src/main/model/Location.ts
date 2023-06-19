export type Location = {
    address: string,
    latitude: number,
    longitude: number
}

export type LocationCreationApiDto = Partial<Location>