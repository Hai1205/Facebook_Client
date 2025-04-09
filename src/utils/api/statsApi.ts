import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/stats";

export const getGeneralStat = async(): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/`)
} 

export const getPopularPostStat = async(): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-popular-post`)
}

export const getTopUsersStat = async(): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-top-users`)
}