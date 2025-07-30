import type { AxiosRequestConfig } from 'axios';

interface HttpSuccessData<T> {
    stat?: number;
    msg?: string;
    message?: string;
    code?: number;
    data?: {
        list?: T[];
        [key: string]: any;
    };
}

interface Get {
    <T>(url: string, config?: AxiosRequestConfig): Promise<HttpSuccessData<T>>;
}

interface Post {
    // eslint-disable-next-line @typescript-eslint/ban-types
    <T>(url: string, params?: string | object, config?: AxiosRequestConfig): Promise<HttpSuccessData<T>>
}

export type{
    Get,
    Post,
    HttpSuccessData
}