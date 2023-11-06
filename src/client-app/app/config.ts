interface IConfig {
    publicHost: string,
    apiHost: string,
    wsProtocol: string
}

export const config: IConfig = {
    publicHost: process.env.PUBLIC_HOST || window.location.origin,
    apiHost: process.env.API_HOST || window.location.origin,
    wsProtocol: isLocalhost() ? 'ws' : 'wss'
}

function isLocalhost(): boolean {
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost';
    }
    
    return process.env.NODE_ENV === 'development';
}