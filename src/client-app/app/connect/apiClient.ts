import {config} from "@/app/config";

interface ITokenResponse {
    token: string,
}

interface ICreateResponse extends ITokenResponse {
    connection_id: string
}

interface IApiClient {
    create(): Promise<ICreateResponse>

    activate(connection_id: string): Promise<ITokenResponse>
}

const client: IApiClient = {
    async activate(connection_id: string): Promise<ITokenResponse> {
        return send<ITokenResponse>(`/api/connect/activate?connection_id=${connection_id}`, 'POST');
    },
    create(): Promise<ICreateResponse> {
        return send<ICreateResponse>('/api/connect/create', 'POST');
    }
}

async function send<T>(url: string, method: "GET" | "POST") {
    const absoluteUrl = new URL(url, config.apiHost);
    const response = await fetch(absoluteUrl, {method});
    return await response.json() as T;
}

export default client