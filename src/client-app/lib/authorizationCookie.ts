
export const setAuthorizationCookie = (token: string) => { 
    document.cookie = `authorization=${token}; path=/`;
}