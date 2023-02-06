export interface Parcel {
    uniqname: string,
    workstation: string,
    trackingNumber: string,
    date?: string,
    status?: string,
    
    // Optional sending data
    client?: string,
    kitType?: string,
    kitBarcode?: string,
    trackingNumberOutbound?: string,
    clinicCode?: string,
    kitID?: string,

    // Optional receiving data
    routingLocation?: string,
    carrier?: string,

    // Optional opening data
    TCDI?: string,
}