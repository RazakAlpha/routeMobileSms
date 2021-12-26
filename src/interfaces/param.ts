export interface IParam {
    protocol: string;
    host?: string;
    port: number;
    path?: string;
    username?: string;
    password?: string;
}

export interface IConfig {
    type?: number;
    dlr?: number;
    source?: string;
    url?: string;
}

export interface IMessageResponse {
    id: string;
    status: string;
    code: number;
    destination: number;
    
}