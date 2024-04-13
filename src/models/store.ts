export interface StoreModel {
    _id?: string,
    name?: string,
    location?: string,
    phone?: string,
    cityId?: string | string[],
    city?: string,
    districtId?: string | string[],
    district?: string,
    wardId?: string | string[],
    ward?: string,
    createAt?: string
    updatedAt?: string
}