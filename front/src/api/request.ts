import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { checkTokenValid, parseToken, clearStorage, AUTH_TOKEN_KEY } from "utils/auth";

const BASE_URL = process.env.REACT_APP_BASE_URL;

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

request.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const tokenstr = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!tokenstr) {
            return config;
        }

        const tokenData = parseToken(tokenstr);
        if (!checkTokenValid(tokenData?.token, tokenData?.expireAt)) {
            clearStorage();
            return Promise.reject();
        }

        if (!config.headers) {
            config.headers = {};
        }
        config.headers["Authorization"] = tokenData?.token || "";
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

/**
 * get
 * @method get
 * @param {url, params, loading}
 */
const get = function (url: string, data = {}, config = {}): Promise<ResponseData> {
    return new Promise((resolve, reject) => {
        request
            .get(url, { params: data, ...config })
            .then((res: AxiosResponse<ResponseData>) => {
                if (res.data.code !== 200 && res.data.code !== 2010) {
                    reject(res.data);
                }
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
/**
 * post
 * @method post
 * @param {url, params}
 */
const post = function (url: string, data = {}): Promise<ResponseData> {
    return new Promise((resolve, reject) => {
        request
            .post(url, data)
            .then((res) => {
                if (res.data.code !== 200) {
                    reject(res.data);
                }
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

/**
 * put
 * @method put
 * @param {url, params}
 */
const put = function (url: string, data = {}): Promise<ResponseData> {
    return new Promise((resolve, reject) => {
        request
            .put(url, data)
            .then((res) => {
                if (res.data.code !== 200) {
                    reject(res.data);
                }
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

/**
 * delete
 * @method delete
 * @param {url, params}
 */
const rdelete = function (url: string, data = {}): Promise<ResponseData> {
    return new Promise((resolve, reject) => {
        request
            .delete(url, data)
            .then((res) => {
                if (res.data.code !== 200) {
                    reject(res.data);
                }
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { get, post, put, delete: rdelete };
