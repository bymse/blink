interface IConfig {
    apiHost: string,
    wsProtocol: string,
    httpProtocol: string
}

export const config: IConfig = {
    apiHost: process.env.API_HOST || window.location.origin,
    wsProtocol: isLocalhost() ? 'ws' : 'wss',
    httpProtocol: isLocalhost() ? 'http' : 'https'
}

function isLocalhost(): boolean {
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost';
    }
    
    return process.env.NODE_ENV === 'development';
}