import {config} from "@/app/config";

interface ITokenResponse {
    token: string,
}

interface ICreateResponse extends ITokenResponse {
    connection_id: string
}

interface IServerApiClient {
    create(): Promise<ICreateResponse>

    activate(connection_id: string): Promise<ITokenResponse>,
    
    submit(token: string, url: string): Promise<void>
}

const client: IServerApiClient = {
    activate(connection_id: string): Promise<ITokenResponse> {
        return send<ITokenResponse>(`/api/connect/activate?connection_id=${connection_id}`, 'POST');
    },
    create(): Promise<ICreateResponse> {
        return send<ICreateResponse>('/api/connect/create', 'POST');
    },
    submit(token: string, url: string): Promise<void> {
        return send<void>('/api/connect/submit', 'POST', token, {url});
    }
}

async function send<T>(url: string, method: "GET" | "POST", token?: string, body?: any) {
    const absoluteUrl = new URL(url, config.apiHost);
    const headers = new Headers();
    const init: RequestInit = {
        method,
    }
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (body) {
        init.body = JSON.stringify(body);
        headers.set('Content-Type', 'application/json');
    }
    init.headers = headers;
    const response = await fetch(absoluteUrl, init);
    
    return await response.json() as T;
}

export default client