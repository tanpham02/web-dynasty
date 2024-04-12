import { TermAndConditionModel } from "~/models/termAndCondition"
import { TERM_AND_CONDITION_URL } from "../apiUrl"
import axiosService from "../axiosService"

export const termAndConditionService = {
    getOne: async (): Promise<TermAndConditionModel> => {
        return axiosService()({
            url: `${TERM_AND_CONDITION_URL}/search-all`,
            method: "GET"
        })
            .then(res => res.data?.[0])
            .catch(err => {
                throw err
            })
    },
    createNew: async (data: FormData): Promise<TermAndConditionModel> => {
        return axiosService()({
            url: TERM_AND_CONDITION_URL,
            method: "POST",
            data
        })
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    },
    update: async (id: string, data: FormData): Promise<TermAndConditionModel> => {
        return axiosService()({
            url: `${TERM_AND_CONDITION_URL}/${id}`,
            method: "PATCH",
            data
        })
            .then(res => res.data)
            .catch(err => {
                throw err
            })
    }
}