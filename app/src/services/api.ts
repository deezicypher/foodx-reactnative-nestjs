import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    saveTokens,
} from '@/libs/auth-storage';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: true
})

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;
let onAuthExpired: (() => void) | undefined;

export function setAuthExpiredHandler(handler: () => void): void {
    onAuthExpired = handler;
}

api.interceptors.request.use(
    async (config) => {
        const token  = await getAccessToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
)

api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const request = error.config as RetriableRequestConfig | undefined;
        const isLoginOrRefreshRequest = request?.url?.includes('/auth/login')
            || request?.url?.includes('/auth/refresh');

        if (error.response?.status !== 401 || !request || request._retry || isLoginOrRefreshRequest) {
            return Promise.reject(error);
        }

        request._retry = true;

        const storedRefreshToken = await getRefreshToken();
        if (!storedRefreshToken) {
            await clearTokens();
            onAuthExpired?.();
            return Promise.reject(error);
        }

        try {
            //  If another request is already refreshing, wait for it
            if (!refreshPromise) { 
                refreshPromise = axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    { refreshToken: storedRefreshToken },
                )
                    .then(async ({ data }) => {
                        await saveTokens(data.accessToken, data.refreshToken);
                        return data.accessToken as string;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const accessToken = await refreshPromise;
            request.headers.Authorization = `Bearer ${accessToken}`;
            return api(request);
        } catch (refreshError) {
            if (
                axios.isAxiosError(refreshError)
                && (refreshError.response?.status === 401 || refreshError.response?.status === 403)
            ) {
                await clearTokens();
                onAuthExpired?.();
            }
            return Promise.reject(refreshError);
        }
    }
)

export default api;