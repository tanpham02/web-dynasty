export interface FAQsModel {
    question?: string
    answer?: string
}
export interface TermAndPolicyModel {
    deliveryPolicy?: string;
    privatePolicy?: string;
    termAndCondition?: string;
}

export interface StoreConfigModel {
    feeShip?: number
    transferContent?: string
    reasonOrderCancel?: string[] | string
    hotlineSupport?: {
        order?: string
        customerCareHotline?: string
    }
}

export interface StoreInformationModel extends LocationBaseModel {
    brandStore?: string
    logo?: string
    name?: string
    description?: string
    email?: string
    phoneNumber?: string
    taxCode?: string
}

export interface StoreSettingModel {
    storeConfig?: StoreConfigModel
    storeInformation?: StoreInformationModel
    faqs?: FAQsModel[]
    termAndPolicy?: TermAndPolicyModel;
}

export interface LocationBaseModel {
    location?: string;
    cityId?: string | string[];
    city?: string;
    districtId?: string | string[];
    district?: string;
    wardId?: string | string[];
    ward?: string;
    latitude?: string;
    longitude?: string;
}