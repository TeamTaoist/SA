import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface ResponseData<T = any> {
    code: number;
    msg: string;
    data: T;
}

const request = axios.create({
    baseURL: BASE_URL,
    timeout: 6000,
    headers: { "Content-Type": "application/json" },
});

// eslint-disable-next-line import/no-anonymous-default-export
export default request;
