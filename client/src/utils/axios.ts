import axios from "axios";


export const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Credentials': "true"
    }
})
