import User from "./human/user/User";

export interface Metadata {
    createdAt: number;
    createdBy: User|null;
    updatedAt: number;
    updatedBy: User|null;
}

export default interface MetadataContainable {
    metadata: Metadata
}