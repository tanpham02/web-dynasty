import { StoreSettingModel } from "~/models/storeSetting"
import { STORE_SETTING_URL } from "../apiUrl"
import axiosService from "../axiosService"

const storeSettingService = {
    getSetting: async (): Promise<StoreSettingModel> => {
        return axiosService()({
            url: STORE_SETTING_URL,
            method: "GET"
        })
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    createSetting: async (data: FormData): Promise<StoreSettingModel> => {
        return axiosService()({
            url: STORE_SETTING_URL,
            method: "POST",
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    updateSetting: async (data: FormData): Promise<StoreSettingModel> => {
        return axiosService()({
            url: STORE_SETTING_URL,
            method: "PATCH",
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    }
}

export default storeSettingService