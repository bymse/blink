
interface IConfig {
    apiHost: string
}

export const config: IConfig = {
    apiHost: process.env.API_HOST || window.location.origin
}