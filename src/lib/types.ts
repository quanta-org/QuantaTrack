export interface Parcel {
    uniqname: string,
    workstation: string,
    carrier?: string,
    trackingNumber: string,
    date?: string,
    kitID?: string,
    status?: string,
    
    // Optional sending data
    client?: string,
    kitType?: string,
    kitBarcode?: string,
    trackingNumberOutbound?: string,
    clinicCode?: string,

    // Optional receiving data
    routingLocation?: string,

    // Optional opening data
    TCDI?: string,
}