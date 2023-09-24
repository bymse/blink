
export const setAuthorizationCookie = (token: string) => { 
    document.cookie = `authorize=${token}; path=/`;
}