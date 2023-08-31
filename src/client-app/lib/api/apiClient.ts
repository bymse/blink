interface IApiClient {
    getToken(): Promise<string>;
}

export default {
    async getToken(): Promise<string> {
        //const response = await fetch('/api/follow/token');
        //const data = await response.json();
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    },
} as IApiClient