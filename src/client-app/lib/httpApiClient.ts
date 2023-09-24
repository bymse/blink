import {config} from "@/app/config";
import {setAuthorizationCookie} from "@/lib/authorizationCookie";

interface ITokenResponse {
    token: string,
}

interface ICreateResponse extends ITokenResponse {
    connection_id: string
}

interface IHttpApiClient {
    create(): Promise<ICreateResponse>

    activate(connection_id: string): Promise<ITokenResponse>,

    submit(token: string, url: string): Promise<void>,

    complete(token: string): void,

    decline(token: string): void
}

const client: IHttpApiClient = {
    activate(connection_id: string): Promise<ITokenResponse> {
        return send<ITokenResponse>(`/api/connect/activate?connection_id=${connection_id}`, 'POST');
    },
    create(): Promise<ICreateResponse> {
        return send<ICreateResponse>('/api/connect/create', 'POST');
    },
    submit(token: string, url: string): Promise<void> {
        setAuthorizationCookie(token);
        return send<void>('/api/connect/submit', 'POST', {url});
    },
    complete(token: string) {
        setAuthorizationCookie(token);
        navigator.sendBeacon(`/api/connect/complete`);
    },
    decline(token: string) {
        setAuthorizationCookie(token);
        navigator.sendBeacon('/api/connect/decline');
    }
}

async function send<T>(url: string, method: "GET" | "POST", body?: any) {
    const absoluteUrl = new URL(url, config.apiHost);
    const init: RequestInit = {
        method,
        cache: 'no-store'
    }
    if (body) {
        init.body = JSON.stringify(body);
        init.headers = {
            'Content-Type': 'application/json'
        };
    }
    const response = await fetch(absoluteUrl, init);

    return await response.json() as T;
}

export default client